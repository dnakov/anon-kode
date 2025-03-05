import * as React from 'react'
import { OrderedList } from '@inkjs/ui'
import { Box, Text } from 'ink'
import {
  getCurrentProjectConfig,
  getGlobalConfig,
  saveCurrentProjectConfig,
  saveGlobalConfig,
} from './utils/config.js'
import { existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import terminalSetup from './commands/terminalSetup'
import { getTheme } from './utils/theme'
import { RELEASE_NOTES } from './constants/releaseNotes'
import { gt } from 'semver'
import { isDirEmpty } from './utils/file'
import { MACRO } from './constants/macros'

// Function to mark onboarding as complete
export function markProjectOnboardingComplete(): void {
  const projectConfig = getCurrentProjectConfig()
  if (!projectConfig.hasCompletedProjectOnboarding) {
    saveCurrentProjectConfig({
      ...projectConfig,
      hasCompletedProjectOnboarding: true,
    })
  }
}

function markReleaseNotesSeen(): void {
  const config = getGlobalConfig()
  saveGlobalConfig({
    ...config,
    lastReleaseNotesSeen: MACRO.VERSION,
  })
}

type Props = {
  workspaceDir: string
}

export default function ProjectOnboarding({
  workspaceDir,
}: Props): React.ReactNode {
  // Check if project onboarding has already been completed
  const projectConfig = getCurrentProjectConfig()
  const showOnboarding = !projectConfig.hasCompletedProjectOnboarding

  // Get previous version from config
  const config = getGlobalConfig()
  const previousVersion = config.lastReleaseNotesSeen

  // Get release notes to show
  let releaseNotesToShow: string[] = []
  if (!previousVersion || gt(MACRO.VERSION, previousVersion)) {
    releaseNotesToShow = RELEASE_NOTES[MACRO.VERSION] || []
  }
  const hasReleaseNotes = releaseNotesToShow.length > 0

  // Mark release notes as seen when they're displayed without onboarding
  React.useEffect(() => {
    if (hasReleaseNotes && !showOnboarding) {
      markReleaseNotesSeen()
    }
  }, [hasReleaseNotes, showOnboarding])

  // We only want to show either onboarding OR release notes (with preference for onboarding)
  // If there's no onboarding to show and no release notes, return null
  if (!showOnboarding && !hasReleaseNotes) {
    return null
  }

  // Load what we need for onboarding
  // NOTE: This whole component is statically rendered Once
  const hasClaudeMd = existsSync(join(workspaceDir, 'KODING.md'))
  const isWorkspaceDirEmpty = isDirEmpty(workspaceDir)
  const needsClaudeMd = !hasClaudeMd && !isWorkspaceDirEmpty
  const showTerminalTip =
    terminalSetup.isEnabled && !getGlobalConfig().shiftEnterKeyBindingInstalled

  const theme = getTheme()

  return (
    <Box flexDirection="column" gap={1} padding={1} paddingBottom={0}>
      {showOnboarding && (
        <>
          <Text color={theme.secondaryText}>Tips for getting started:</Text>
          <OrderedList>
            {/* Collect all the items that should be displayed */}
            {(() => {
              const items = []

              if (isWorkspaceDirEmpty) {
                items.push(
                  <OrderedList.Item key="workspace">
                    <Text color={theme.secondaryText}>
                      Ask Kode to create a new app or clone a repository.
                    </Text>
                  </OrderedList.Item>,
                )
              }
              if (needsClaudeMd) {
                items.push(
                  <OrderedList.Item key="claudemd">
                    <Text color={theme.secondaryText}>
                      Run <Text color={theme.text}>/init</Text> to create a
                      KODING.md file with instructions for Anon Kode.
                    </Text>
                  </OrderedList.Item>,
                )
              }

              if (showTerminalTip) {
                items.push(
                  <OrderedList.Item key="terminal">
                    <Text color={theme.secondaryText}>
                      Run <Text color={theme.text}>/terminal-setup</Text>
                      <Text bold={false}> to set up terminal integration</Text>
                    </Text>
                  </OrderedList.Item>,
                )
              }

              items.push(
                <OrderedList.Item key="questions">
                  <Text color={theme.secondaryText}>
                    Ask Kode questions about your codebase.
                  </Text>
                </OrderedList.Item>,
              )

              items.push(
                <OrderedList.Item key="changes">
                  <Text color={theme.secondaryText}>
                    Ask Kode to implement changes to your codebase.
                  </Text>
                </OrderedList.Item>,
              )

              return items
            })()}
          </OrderedList>
        </>
      )}

      {!showOnboarding && hasReleaseNotes && (
        <Box
          borderColor={getTheme().secondaryBorder}
          flexDirection="column"
          marginRight={1}
        >
          <Box flexDirection="column" gap={0}>
            <Box marginBottom={1}>
              <Text>🆕 What&apos;s new in v{MACRO.VERSION}:</Text>
            </Box>
            <Box flexDirection="column" marginLeft={1}>
              {releaseNotesToShow.map((note, noteIndex) => (
                <Text key={noteIndex} color={getTheme().secondaryText}>
                  • {note}
                </Text>
              ))}
            </Box>
          </Box>
        </Box>
      )}

      {workspaceDir === homedir() && (
        <Text color={getTheme().warning}>
          Note: You have launched <Text bold>anon-code</Text> in your home
          directory. For the best experience, launch it in a project directory
          instead.
        </Text>
      )}
    </Box>
  )
}
