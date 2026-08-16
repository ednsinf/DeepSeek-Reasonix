; Reasonix Installer - Simple and reliable
Unicode true
!include "MUI.nsh"

Name "Reasonix"
OutFile "Reasonix-Setup.exe"
InstallDir "$LOCALAPPDATA\Programs\Reasonix"
RequestExecutionLevel user

!define MUI_ICON "upstream\desktop\build\windows\icon.ico"
!define MUI_UNICON "upstream\desktop\build\windows\icon.ico"
!define MUI_FINISHPAGE_NOAUTOCLOSE
!define MUI_ABORTWARNING

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_LANGUAGE "PortugueseBR"

Section "Install"
    SetOutPath $INSTDIR

    ; Kill running instances (simple, reliable)
    nsExec::ExecToStack 'cmd.exe /C taskkill /F /IM Reasonix.exe'
    nsExec::ExecToStack 'cmd.exe /C taskkill /F /IM reasonix-desktop.exe'
    Sleep 2000

    ; Copy files
    File "upstream\desktop\build\bin\Reasonix.exe"

    ; Create shortcuts
    CreateShortcut "$SMPROGRAMS\Reasonix.lnk" "$INSTDIR\Reasonix.exe"
    CreateShortcut "$DESKTOP\Reasonix.lnk" "$INSTDIR\Reasonix.exe"

    ; Create uninstaller
    WriteUninstaller "$INSTDIR\uninstall.exe"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Reasonix" "DisplayName" "Reasonix"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Reasonix" "UninstallString" '"$INSTDIR\uninstall.exe"'
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Reasonix" "DisplayIcon" "$INSTDIR\Reasonix.exe"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Reasonix" "Publisher" "Reasonix"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Reasonix" "DisplayVersion" "1.25.2"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Reasonix" "InstallLocation" "$INSTDIR"
SectionEnd

Section "Uninstall"
    ; Kill running instances
    nsExec::ExecToStack 'cmd.exe /C taskkill /F /IM Reasonix.exe'
    nsExec::ExecToStack 'cmd.exe /C taskkill /F /IM reasonix-desktop.exe'
    Sleep 1000

    ; Remove files
    Delete "$INSTDIR\Reasonix.exe"
    Delete "$INSTDIR\uninstall.exe"
    RMDir "$INSTDIR"

    ; Remove shortcuts
    Delete "$SMPROGRAMS\Reasonix.lnk"
    Delete "$DESKTOP\Reasonix.lnk"

    ; Remove registry
    DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Reasonix"
SectionEnd
