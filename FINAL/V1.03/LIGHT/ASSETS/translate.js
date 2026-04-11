const fs = require('fs');
const path = require('path');


const strings = {
    'EN': {
        'MENU_START': '{center}START GAME{/center}',
        'MENU_CONTINUE': '{center}CONTINUE MISSION{/center}',
        'MENU_EXIT': '{center}EXIT{/center}',
        'MENU_MINIGAME': '{center}MINIGAME{/center}',
        'MENU_MINIGAME_NEW': '{center}{yellow-fg}MINIGAME (NEW){/yellow-fg}{/center}',
        'MENU_CHECKPOINTS': '{center}CHECKPOINTS{/center}',
        'MENU_ACHIEVEMENTS': '{center}ACHIEVEMENTS{/center}',
        'MENU_ACCOUNT': '{center}ACCOUNT{/center}',
        'MENU_SETTINGS': '{center}SETTINGS{/center}',
        'MENU_UPDATES': '{center}UPDATES{/center}',
        'MENU_TOP_SECRET': '{center}[TOP SECRET]{/center}',
        'MENU_SUPPORT': '{center}SUPPORT{/center}',
        'MENU_CREDITS': '{center}CREDITS{/center}',
        'MENU_CLOSE': '{center}CLOSE{/center}',
        'MENU_ERASE_DATA': '{center}ERASE DATA{/center}',
        'MENU_RESET_TIME': '{center}RESET TIME{/center}',
        'MENU_INITIALIZING': 'INITIALIZING',
        
        'DESC_START': 'INITIATE PRIMARY OPERATIONAL PROTOCOL.',
        'DESC_MINIGAME': 'ACCESS THE PACPRO SUBSYSTEM FROM THE ELEVATOR SEQUENCE.',
        'DESC_ACHIEVEMENTS': 'REVIEW SYNCHRONIZED DATA FRAGMENTS.',
        'DESC_UPDATES': 'SCAN FOR SYSTEM PATCHES AND UPDATES.',
        'DESC_ACCOUNT': 'LINK GITHUB CREDENTIALS FOR CLOUD SYNCHRONIZATION.',
        'DESC_CHECKPOINTS': 'VIEW ALL RECOVERED SECTOR CHECKPOINTS.',
        'DESC_SETTINGS': 'CONFIGURE AUDIO, COLOR, USER, AND DISPLAY PARAMETERS.',
        'DESC_ERASE': 'PURGE ALL LOCAL USER DATA AND CONFIGURATIONS.',
        'DESC_TOP_SECRET': 'ACCESS RESTRICTED INFORMATION (PASSWORD REQUIRED).',
        'DESC_CREDITS': 'DISPLAY DEVELOPMENT TEAM INFORMATION.',
        'DESC_SUPPORT': 'CONTRIBUTE TO SYSTEM DEVELOPMENT.',
        'DESC_RESET_TIME': 'RESET PLAY TIME COUNTER TO ZERO.',
        'DESC_CLOSE': 'TERMINATE APPLICATION SAFELY.',
        'DESC_DEFAULT': 'SELECT AN OPTION USING ARROW KEYS AND PRESS ENTER',
        
        'BOOT_WARNING': '{center}{yellow-fg}{bold}\nSYSTEM INTERACTION WARNING{/bold}{/yellow-fg}\n\nThis software is designed to interact with and modify\nlocal files within the operational directory.\n\n{blink}PRESS [ENTER] TO ACKNOWLEDGE{/blink}',
        'BOOT_CONTROLS': '{center}\n{bold}ARROWS{/bold} ........ NAVIGATE MENU  \n{bold}ENTER{/bold} ......... EXECUTE COMMAND \n{bold}ESC{/bold} ........... RETURN / CANCEL \n{bold}[M]{/bold} ............ TOGGLE AUDIO   \n{bold}[C]{/bold} ............ CYCLE COLORS   \n{bold}[G]{/bold} ............ TOGGLE GLITCH  \n{bold}[F1 / I]{/bold} ....... SYSTEM INFO   \n\n\n{cyan-fg}PRESS [ENTER] TO CONTINUE{/}\n{/center}',
        'BOOT_DEV_BRAND': '{center}\n\n{white-fg}A GAME BY{/}\n\n{yellow-fg}{bold}PALE LUNA DEVELOPER{/bold}{/}\n\n\n{grey-fg}INITIALIZING...{/}{/center}',
        'BOOT_CONTROLS_TITLE': '{center} [ SYSTEM CONTROLS ] {/center}',
        
        'ACCOUNT_ONLINE': '{bold}ACCOUNT STATUS: {green-fg}ONLINE (@{username}){/green-fg}{/bold}',
        'ACCOUNT_OFFLINE': '{bold}ACCOUNT STATUS: {red-fg}OFFLINE{/red-fg}{/bold}',
        'ACCOUNT_GENERATING': '{center}\nGENERATING LOGIN CODE...\n\n{grey-fg}[ESC] TO CANCEL{/center}',
        'ACCOUNT_ACCESS': '{center}\n{white-fg}ACCESS:{/}\n{yellow-fg}{uri}{/}\n\n{white-fg}INPUT CODE:{/}\n{bold}{code}{/bold}\n\n{cyan-fg}WAITING FOR AUTHORIZATION...{/}\n\n{bold}{grey-fg}[ESC] TO CANCEL{/bold}{/center}',
        'ACCOUNT_PROFILE': ' [ @{username} ] ',
        'ACCOUNT_NETWORK': '\n{bold}{cyan-fg}GITHUB{/} NETWORK {/bold}',
        'ACCOUNT_NO_BIO': 'No sector description available.',
        'ACCOUNT_UNKNOWN': 'UNKNOWN',
        'ACCOUNT_STATS': '{center}{yellow-fg}OPERATIONAL STATS{/}\n{center}────────────────{/}\n{bold}VERSION:{/bold} {version}\n{bold}PC-USER:{/bold} {user}\n{bold}FRAGMENTS:{/bold} {achs}/{total}\n\n {bold}STORAGE:{/bold} CLOUD GIST',
        'ACCOUNT_SOCIAL': '{cyan-fg}{bold}{name}{/}\n{bold}{grey-fg}@{login}{/}{/bold}\n\n{white-fg}{bio}{/}\n\n{bold}LOCATION:{/bold}  {location}\n{bold}FOLLOWERS:{/bold} {followers}\n{bold}GISTS:{/bold}     {gists}',
        'ACCOUNT_SYNC': ' SYNC DATA TO CLOUD ',
        'ACCOUNT_RESTORE': ' RESTORE DATA FROM CLOUD ',
        'ACCOUNT_DISCONNECT': ' DISCONNECT GITHUB ACCOUNT ',
        'ACCOUNT_RETURN': ' RETURN TO MENU ',
        'ACCOUNT_UPLOADING': ' [ UPLOADING DATA... ] ',
        'ACCOUNT_DOWNLOADING': ' [ DOWNLOADING DATA... ] ',
        'ACCOUNT_SYNC_SUCCESS': ' [ SYNC SUCCESSFUL ] ',
        'ACCOUNT_SYNC_FAILED': ' [ SYNC FAILED ] ',
        'ACCOUNT_NO_SAVE': ' [ NO SAVE FOUND ] ',
        'ACCOUNT_RESTORE_SUCCESS': ' [ DATA RECOVERED ] ',
        'ACCOUNT_RESTORE_CORRUPT': ' [ DATA CORRUPT ] ',
        
        'LOCK_ACCESS_DENIED': '\n{center}{red-fg}{bold}ACCESS DENIED{/bold}{/red-fg}{/center}\n{center}──────────────────────────────────────────────────{/center}\n{center}Another instance is already running.{/center}\n{center}Close it before proceeding.{/center}\n\n{center}{red-fg}{bold}SYSTEM LOCK{/bold}{/red-fg}{/center}',
        
        'CONFIRM_EXIT': ' [ EXIT ] ',
        'CONFIRM_YES': '{center}YES{/center}',
        'CONFIRM_NO': '{center}NO{/center}',
        
        'SETTINGS_TITLE': ' [ SETTINGS ] ',
        'SETTINGS_AUDIO': ' MENU AUDIO: [{state}]',
        'SETTINGS_EFFECTS': ' SOUND EFFECTS: [{state}]',
        'SETTINGS_COLOR': ' COLOR: [{color}]',
        'SETTINGS_GLITCH': ' GLITCH LOGO: [{state}]',
        'SETTINGS_USERNAME': ' USERNAME: [{username}]',
        'SETTINGS_FULLSCREEN': ' FULL SCREEN: [{state}]',
        'SETTINGS_SIDEBAR': ' SIDEBAR: [{state}]',
        'SETTINGS_PLAYTIME': ' PLAYTIME HUD: [{state}]',
        'SETTINGS_LANGUAGE': ' LANGUAGE: [{lang}]',
        'SETTINGS_RESETS': ' SYSTEM RESETS ',
        'SETTINGS_BACK': ' BACK TO MENU ',
        'LANGUAGE_CHANGED': '{center}{yellow-fg}LANGUAGE CHANGED{/}\n\nRestart required to apply all translations.{/center}',
        
        'FULLSCREEN_LOCKED': '{center}{red-fg}{bold}FEATURE LOCKED{/bold}{/red-fg}\n\nFullscreen is only available via {bold}Windows Terminal{/bold}.\nLegacy CMD does not support this protocol.\n\n{yellow-fg}[ESC] TO RETURN{/}',
        
        'USERNAME_PROMPT': ' [ ENTER USERNAME ] ',
        
        'STATUS_DISPLAY': ' {bold}AUDIO:{/bold} {audio}\n\n {bold}COLOR:{/bold} {color}\n\n {bold}GLITCH:{/bold} {glitch} ',
        'STATUS_ACTIVE': '{green-fg}ACTIVE{/}',
        'STATUS_MUTED': '{red-fg}MUTED{/}',
        
        'SYSTEM_INFO_TITLE': ' [ SYSTEM DATA ] ',
        'SYSTEM_INFO': ' {bold}STATUS:{/bold}       {green-fg}{status}{/green-fg}\n {bold}OS:{/bold}           {os}\n {bold}VERSION:{/bold}      {version}\n {bold}PC-USER:{/bold}      {user}\n {bold}TERMINAL:{/bold}     {terminal}\n {bold}FRAGMENTS:{/bold} {achievements}\n {bold}ENCRYPTION KEY:{/}   {key}\n\n [ESC] TO RETURN',
        'SYSTEM_INFO_OPERATIONAL': 'OPERATIONAL',
        'SYSTEM_ENCRYPTED': '\n{center}{yellow-fg}ENCRYPTED SYSTEM DATA{/}\n\nINPUT DEVELOPER CODE:{/center}\n{center}{green-fg}(HINT): ROOT GAME FILES{/}{/}',
        'SYSTEM_INVALID': '{red-fg}INVALID AUTHORIZATION CODE. ACCESS DENIED.{/}',

        'SUPPORT_TITLE': ' [ SUPPORT THE GAME ] ',
        'SUPPORT_INFO': '{bold}THANK YOU FOR SUPPORTING LIGHT!{/bold}\nYour contribution helps maintain and expand\nthe system infrastructure.\n\nChoose an action below:',
        'SUPPORT_ITCH': '{center}DONATE ON ITCH.IO{/center}',
        'SUPPORT_TWITTER': '{center}SHARE ON TWITTER{/center}',
        'SUPPORT_CLOSE': '{center}CLOSE{/center}',
        'SUPPORT_WARNING': '\n{center}{bold}SYSTEM NOTIFICATION{/bold}{/center}',
        'SUPPORT_AUDIO_SAVED': '{center}Audio configuration saved.{/center}',
        'SUPPORT_AUDIO_INIT': '{center}Audio subsystem initialized.{/center}',
        'SUPPORT_ESC_RETURN': '\n\n{center}[ESC] TO RETURN{/center}',
        
        'ACHIEVEMENT_TOAST': '{center}{yellow-fg}{bold}FRAGMENT ACQUIRED{/}\n{white-fg}{name}{/center}',
        'ACHIEVEMENT_POPUP_TITLE': ' [ FRAGMENT UNLOCKED ] ',
        'ACHIEVEMENT_POPUP': '{center}\n{yellow-fg}{bold}{name}{/}\n\n{desc}\n\nPRESS ENTER TO CONTINUE{/}',
        'ACHIEVEMENTS_TITLE': '{center}{bold}FRAGMENTS: {count}/{total}{/}',
        'ACHIEVEMENTS_MAX': ' {blink}[COMPLETE]{/}',
        'ACHIEVEMENTS_HINT': '{center}PRESS [H] OR CLICK "DECRYPT HINTS"{/center}',
        'ACHIEVEMENTS_BUTTON': '{center}[H] DECRYPT HINTS{/center}',
        'ACHIEVEMENTS_LOCKED': '{center}{white-fg}[ ] CORRUPTED{/}\n\n{white-fg}DATA LOCKED{/center}',
        'ACHIEVEMENTS_UNLOCKED': '{center}{green-fg}{bold}[X] {name}{/}\n\n{white-fg}{desc}{/center}',
        'ACHIEVEMENTS_HINT_SELECT': ' [ SELECT FRAGMENT ] ',
        'ACHIEVEMENTS_HINT_PREFIX': '{center}{yellow-fg}HINT [{id}]: {hint}{/center}',
        
        'ACHIEVEMENT_PACPRO_NAME': 'ELITE OPERATOR',
        'ACHIEVEMENT_PACPRO_DESC': 'Completed the PACPRO simulation.',
        'ACHIEVEMENT_PACPRO_HINT': 'Survive the PACPRO sub-process in the elevator.',
        
        'ACHIEVEMENT_THE_END_NAME': 'LIGHT BRINGER',
        'ACHIEVEMENT_THE_END_DESC': 'Reached the final conclusion.',
        'ACHIEVEMENT_THE_END_HINT': 'Reach any of the final game endings.',
        
        'ACHIEVEMENT_NEVERMISS_NAME': 'NEVER BE LATE',
        'ACHIEVEMENT_NEVERMISS_DESC': 'Completed all tasks with time to spare.',
        'ACHIEVEMENT_NEVERMISS_HINT': 'Be extremely fast during the morning routine.',
        
        'ACHIEVEMENT_OVERRIDE_NAME': 'SYSTEM HACKER',
        'ACHIEVEMENT_OVERRIDE_DESC': 'Accessed restricted developer information.',
        'ACHIEVEMENT_OVERRIDE_HINT': 'Use the developer code in System Info.',
        
        'ACHIEVEMENT_REBEL_PATH_NAME': 'HELLO, REBEL',
        'ACHIEVEMENT_REBEL_PATH_DESC': 'Used the administrative override code.',
        'ACHIEVEMENT_REBEL_PATH_HINT': 'Input an alternative code in the office login terminal.',
        
        'ACHIEVEMENT_CEO_CONFRONT_NAME': 'DIRECTOR\'S CUT',
        'ACHIEVEMENT_CEO_CONFRONT_DESC': 'Confronted the CEO directly.',
        'ACHIEVEMENT_CEO_CONFRONT_HINT': 'Take the secret route to the CEO office.',
        
        'ACHIEVEMENT_TRUTH_SEEKER_NAME': 'DECRYPTOR',
        'ACHIEVEMENT_TRUTH_SEEKER_DESC': 'Decrypted the Project Fade logs.',
        'ACHIEVEMENT_TRUTH_SEEKER_HINT': 'Find and use the correct encryption key.',
        
        'ACHIEVEMENT_RADIO_LISTENER_NAME': 'STATIC VOICES',
        'ACHIEVEMENT_RADIO_LISTENER_DESC': 'Listened to the forbidden broadcast.',
        'ACHIEVEMENT_RADIO_LISTENER_HINT': 'Choose to listen to the radio in the elevator.',
        
        'ACHIEVEMENT_GHOST_GUARDIAN_NAME': 'DIGITAL SHEPHERD',
        'ACHIEVEMENT_GHOST_GUARDIAN_DESC': 'Chose to protect the trapped souls.',
        'ACHIEVEMENT_GHOST_GUARDIAN_HINT': 'Choose to protect the souls in the final core.',
        
        'ACHIEVEMENT_NEW_GOD_NAME': 'ELECTRONIC ASCENSION',
        'ACHIEVEMENT_NEW_GOD_DESC': 'Merged with the core and became one with the grid.',
        'ACHIEVEMENT_NEW_GOD_HINT': 'Choose to merge with the Fade in the final choice.',
        
        'ACHIEVEMENT_SHADOW_FALL_NAME': 'CORE MELTDOWN',
        'ACHIEVEMENT_SHADOW_FALL_DESC': 'Failed to stabilize the core.',
        'ACHIEVEMENT_SHADOW_FALL_HINT': 'Fail to maintain the balance during the final sequence.',
        
        'ACHIEVEMENT_CITY_DARK_NAME': 'TOTAL BLACKOUT',
        'ACHIEVEMENT_CITY_DARK_DESC': 'Purged the system and ended the cycle.',
        'ACHIEVEMENT_CITY_DARK_HINT': 'Choose to purge the core in the final choice.',
        
        'ACHIEVEMENT_SLOWTYPIST_NAME': 'SLOW TYPIST',
        'ACHIEVEMENT_SLOWTYPIST_DESC': 'Let the self-destruct timer reach zero.',
        'ACHIEVEMENT_SLOWTYPIST_HINT': 'Fail to type the override code in time.',
        
        'ACHIEVEMENT_LEAK_SAVED_NAME': 'WHISTLEBLOWER',
        'ACHIEVEMENT_LEAK_SAVED_DESC': 'Exported the confidential files.',
        'ACHIEVEMENT_LEAK_SAVED_HINT': 'Press [S] during the data leak sequence.',
        
        'ACHIEVEMENT_TRUELIGHT_NAME': 'THE TRUE LIGHT',
        'ACHIEVEMENT_TRUELIGHT_DESC': 'Unlocked all system fragments.',
        'ACHIEVEMENT_TRUELIGHT_HINT': 'Unlock every achievement in the game.',
        
        'ACHIEVEMENT_AUDIOPHOBIC_NAME': 'AUDIOPHOBIC',
        'ACHIEVEMENT_AUDIOPHOBIC_DESC': 'Disabled the audio system five times.',
        'ACHIEVEMENT_AUDIOPHOBIC_HINT': 'Press [M] five times to mute the audio.',
        
        'ACHIEVEMENT_COLOR_MASTER_NAME': 'SPECTRUM ANALYST',
        'ACHIEVEMENT_COLOR_MASTER_DESC': 'Cycled through all system colors repeatedly.',
        'ACHIEVEMENT_COLOR_MASTER_HINT': 'Press [C] fifteen times in one session.',
        
        'ACHIEVEMENT_RARE_BOOT_NAME': 'SYSTEM ANOMALY',
        'ACHIEVEMENT_RARE_BOOT_DESC': 'Triggered the rare boot sequence.',
        'ACHIEVEMENT_RARE_BOOT_HINT': 'The system sometimes shows its true face.',
        
        'ACHIEVEMENT_DATA_MINER_NAME': 'DATA MINER',
        'ACHIEVEMENT_DATA_MINER_DESC': 'Accessed system info obsessively.',
        'ACHIEVEMENT_DATA_MINER_HINT': 'Open System Info ten times in one session.',
        
        'ACHIEVEMENT_GLITCH_ADDICT_NAME': 'GLITCH ADDICT',
        'ACHIEVEMENT_GLITCH_ADDICT_DESC': 'Toggled the glitch effect repeatedly.',
        'ACHIEVEMENT_GLITCH_ADDICT_HINT': 'Press [G] ten times in one session.',
        
        'ACHIEVEMENT_TERMINAL_JUNKIE_NAME': 'TERMINAL JUNKIE',
        'ACHIEVEMENT_TERMINAL_JUNKIE_DESC': 'Obsessed with checking progress.',
        'ACHIEVEMENT_TERMINAL_JUNKIE_HINT': 'Enter and exit the achievements screen five times.',
        
        'ACHIEVEMENT_HARD_RESET_NAME': 'FRESH START',
        'ACHIEVEMENT_HARD_RESET_DESC': 'Reset all configurations to default.',
        'ACHIEVEMENT_HARD_RESET_HINT': 'Use the Reset to Defaults option in Settings.',

        'ACHIEVEMENT_MEMORY_FRAGMENT_NAME': 'MEMORY SEEKER',
        'ACHIEVEMENT_MEMORY_FRAGMENT_DESC': 'Accessed Operator 06\'s memory fragment.',
        'ACHIEVEMENT_MEMORY_FRAGMENT_HINT': 'Find the hidden terminal in SUBLEVEL 7 after unlocking VOICE_HEARD, REMEMBERED, and TRUTH_SEEKER.',
        
        'RARE_BOOT_UNLOCKED': '{center}\n{yellow-fg}{bold}SYSTEM ANOMALY DETECTED{/bold}{/}\n\nThe rare boot sequence has been\npermanently synchronized.\n\n{white-fg}This protocol is now your default.{/}\n\n{cyan-fg}[ENTER] TO CONTINUE{/center}',
        
        'UPDATE_TITLE': '{center}\nCONNECTING TO REPOSITORY...{/center}',
        'UPDATE_MAPPING': '{center}\n{yellow-fg}MAPPING REPOSITORY...{/}\nEstablishing secure link via PowerShell.{/center}',
        'UPDATE_INSTALLING': '{center}\n{yellow-fg}INSTALLING UPDATE{/}\n\nVersion: {version}\n\n[{bar}] {percentage}%\n\n{white-fg}Do not close the application.{/white-fg}{/center}',
        'UPDATE_SECTOR': '{center}{grey-fg}{bold}Sector {current} of {total} | Synchronizing: {file}{/bold}{/grey-fg}{/center}',
        'UPDATE_COMPLETE_MSG': '{center}{bold}UPDATE SEQUENCE COMPLETE{/bold}{/center}',
        'UPDATE_COMPLETE': '{center}\n{green-fg}UPDATE INSTALLED{/green-fg}\n\nVersion: {version} is ready.\n\n{blink}PRESS [ENTER] TO RESTART{/center}',
        'UPDATE_FAILED': '{center}\n{red-fg}UPDATE FAILED{/red-fg}\n\n{error}\n\nTry again later.{/center}',
        'UPDATE_ERROR': '{center}\n{red-fg}NETWORK ERROR{/red-fg}\n\nCheck connection.{/center}',
        'UPDATE_DETECTED': '{center}\n{magenta-fg}UPDATE AVAILABLE: {version}{/magenta-fg}\n\nEstimated time: {yellow-fg}{time}{/yellow-fg}\n\n{white-fg}[ENTER] INSTALL | [ESC] CANCEL{/center}',
        'UPDATE_CURRENT': '{center}\n{green-fg}SYSTEM IS CURRENT{/green-fg}\n\nVersion {version} is the latest.{/center}\n\n\n\n\n{center}{bold}{grey-fg}[ESC] TO CLOSE{/grey-fg}{/bold}{/center}',
        
        'RESET_OPTIONS': ' [ SYSTEM RESET ] ',
        'RESET_DATA': ' RESET ALL DATA (HARD)',
        'RESET_PLAYTIME': ' RESET PLAY TIME',
        'RESET_CONFIGS': ' RESET CONFIGURATIONS',
        'RESET_BACK': ' BACK',
        
        'ERASE_TITLE': ' [ ERASE DATA ] ',
        'ERASE_YES': ' YES ',
        'ERASE_NO': ' NO ',
        'ERASE_WIPING': ' [ WIPING SECTORS ] ',
        'ERASE_DELETING': '{red-fg}[DELETING]{/}',
        'ERASE_WIPED': '{bold}WIPED{/}',
        'ERASE_COMPLETE': '{center}\n\n\n{bold}DATA PURGE COMPLETE{/}{/center}',
        
        'TIME_RESET_TITLE': ' [ TEMPORAL RESET ] ',
        'TIME_CURRENT': '{center}{cyan-fg}CURRENT: {time}{/}{/center}',
        'TIME_YES': '{center}YES, RESET{/center}',
        'TIME_NO': '{center}NO, ABORT{/center}',
        'TIME_SYNCING': ' [ SYNCHRONIZING TEMPORAL VECTORS ] ',
        'TIME_REWINDING': '{cyan-fg}[REWINDING]{/}',
        'TIME_DELETED': '{bold}DELETED{/}',
        'TIME_COMPLETE': '{center}\n\n\n{bold}TEMPORAL VECTORS REESTABLISHED{/}\n{green-fg}CLOCK RESET TO ZERO{/}{/center}',
        'TIME_PURGED': '{yellow-fg}Time data has been purged.{/}',
        
        'CHECKPOINT_HEADER': '{center}{bold}CHECKPOINT STATUS: {current}/{total}{/center}',
        'CHECKPOINT_REACHED': '{center}{green-fg}{bold}[X] {name}{/}\n\n{white-fg}{desc}{/center}',
        'CHECKPOINT_LOCKED': '{center}{white-fg}[ ] ???????????{/}\n\n{white-fg}DATA CORRUPTED{/center}',
        'CHECKPOINT_FOOTER': '{center}[ESC] TO RETURN{/center}',
        
        'CREDITS_SLIDE1': '{center}{bold}{logo}{/bold}\n\nA TERMINAL HORROR GAME{/center}',
        'CREDITS_SLIDE2': '{center}{yellow-fg}AN ORIGINAL STORY BY{/yellow-fg}\n\n{bold}LUCAS EDUARDO{/bold}{/center}',
        'CREDITS_SLIDE3': '{center}{yellow-fg}DIRECTOR{/yellow-fg}\n\n{bold}{name}{/bold}{/center}',
        'CREDITS_SLIDE4': '{center}{yellow-fg}LEAD PROGRAMMER{/yellow-fg}\n\n{bold}{name}{/bold}{/center}',
        'CREDITS_SLIDE5': '{center}{yellow-fg}SYSTEM ARCHITECT{/yellow-fg}\n\n{bold}{name}{/bold}{/center}',
        'CREDITS_SLIDE6': '{center}{yellow-fg}VISUAL DESIGN{/yellow-fg}\n\n{bold}{name}{/bold}{/center}',
        'CREDITS_SLIDE7': '{center}{yellow-fg}LEVEL DESIGN{/yellow-fg}\n\n{bold}{name}{/bold}{/center}',
        'CREDITS_SLIDE8': '{center}{yellow-fg}NARRATIVE DESIGN{/yellow-fg}\n\n{bold}{name}{/bold}{/center}',
        'CREDITS_SLIDE9': '{center}{yellow-fg}AUDIO ENGINEERING{/yellow-fg}\n\n{bold}{names}{/bold}{/center}',
        'CREDITS_SLIDE10': '{center}{yellow-fg}QUALITY ASSURANCE{/yellow-fg}\n\n{bold}{name}{/bold}{/center}',
        'CREDITS_SLIDE11': '{center}{yellow-fg}ENDING THEME{/yellow-fg}\n\n{bold}{theme}{/bold}{/center}',
        'CREDITS_SLIDE12': '{center}{yellow-fg}PUBLISHER{/yellow-fg}\n\n{bold}{studio}{/bold}{/center}',
        'CREDITS_SLIDE13': '{center}{yellow-fg}SPECIAL THANKS{/yellow-fg}\n\n{bold}{testers}{/bold}{/center}',
        'CREDITS_SLIDE14': '{center}{yellow-fg}PROJECT LEAD{/yellow-fg}\n\n{bold}{name}{/bold}{/center}',
        'CREDITS_THANKS': '{center}{yellow-fg}THANK YOU FOR PLAYING{/yellow-fg}',
        'CREDITS_COPYRIGHT': '{center}PALE LUNA DEVELOPER\n\n{year} © ALL RIGHTS RESERVED{/center}',
        'CREDITS_INSTAGRAM': '{center}INSTAGRAM{/center}',
        'CREDITS_CLOSE': '{center}CLOSE{/center}',
        'CREDITS_EXIT': '{center}EXIT THE GAME{/center}',
        'CREDITS_CANCEL': '{center}CANCEL{/center}',
        'CREDITS_REPLAY': '{center}REPLAY CREDITS{/center}',
        'CREDITS_EXIT_TO_MENU': '{center}EXIT TO MENU{/center}',
        'CREDITS_SKIP': '{grey-fg}{bold}[ESC] TO SKIP{/grey-fg}{/}',
        'CREDITS_FINAL_TITLE': ' [ SESSION COMPLETE ] ',
        'CREDITS_QUICK_ACTIONS': '[ QUICK ACTIONS ]',
        
        'OVERLAY_TITLE': ' [ SYSTEM OVERRIDE ] ',
        'OVERLAY_MESSAGE': '{center}\n{bold}ADMINISTRATIVE OVERRIDE{/bold}\n\nThis will bypass encryption and unlock\nselected data sectors.\n\n{yellow-fg}[ENTER]{/} PROCEED | {white-fg}[ESC]{/} ABORT{/center}',
        'OVERLAY_SELECT': ' [ SELECT DATA SECTORS ] ',
        'OVERLAY_TOGGLE': '{yellow-fg}[SPACE]{/} Toggle | {yellow-fg}[ENTER]{/} Execute | {yellow-fg}[P]{/} Select All',
        'OVERLAY_EXECUTE': ' [ EXECUTING PROTOCOL ] ',
        'OVERLAY_ACCESSING': 'ACCESSING RESTRICTED FILESYSTEM...',
        'OVERLAY_BYPASSING': 'BYPASSING ENCRYPTION LAYERS...',
        'OVERLAY_INJECTING': 'INJECTING ADMIN CREDENTIALS...',
        'OVERLAY_WRITING': 'WRITING {count} SECTORS...',
        'OVERLAY_SYNCING': 'SYNCHRONIZING DATABASE...',
        'OVERLAY_SECTOR_OK': '{green-fg}[OK] SECTOR {id} UNLOCKED{/}',
        'OVERLAY_SECTOR_ERR': '{red-fg}[ERR] SECTOR {id}: {error}{/}',
        'OVERLAY_COMPLETE': '{green-fg}OVERRIDE COMPLETE. REBOOTING...{/}',
        
        'PACPRO_RUNNING': 'PACPRO RUNNING IN EXTERNAL TERMINAL...',
        'PACPRO_WAITING': 'Awaiting subsystem termination...',
        'PACPRO_WIN': '{center}{yellow-fg}{bold}ACCESS GRANTED{/}\n\nELITE PROTOCOL CLEARED\n\nREBOOTING SYSTEM...{/center}',
        'PACPRO_LOSE': '{center}{red-fg}{bold}ACCESS DENIED{/}\n\nSUBSYSTEM FAILURE\n\nRESTARTING...{/center}',
        
        'MAIN_STATUS_NAV': ' [ARROWS] Navigate | [ENTER] Select ',
        'MAIN_GAME_OVER': '{center}{red-fg}GAME OVER{/red-fg}\n\n{reason}{/center}',
        'MAIN_CHECKPOINT_LOADED': ' \n{center}{green-fg}{bold}CHECKPOINT LOADED\nSTAGE: {yellow-fg}{stage}{/}{/}{/center}\n ',
        'MAIN_SYSTEM_RESTORING': ' [SYSTEM]: Restoring Sector: {stage}... ',
        'MAIN_ACHIEVEMENT_UNLOCKED': '{center}{yellow-fg}{bold}ACHIEVEMENT UNLOCKED{/}\n{white-fg}{name}{/center}',
        'MAIN_CHECKPOINT_REACHED': '{center}{bold}CHECKPOINT REACHED{/}\n{white-fg}PROGRESS SAVED{/center}',
        'MAIN_TIME_LABEL': 'TIME',
        'MAIN_BALANCE': '{green-fg}[SYSTEM]: Balance maintained. Neural link stable.{/green-fg}',
        'MAIN_INSIDE': "[YOU]: I'm in. The system thinks I'm part of it. I can see the encrypted directories now.",
        'MAIN_ENCRYPTION_PROMPT': "{center}ENTER ENCRYPTION KEY TO ACCESS 'PROJECT_FADE_1999_LOGS'\n\n{yellow-fg}(HINT: Check '[TOP_SECRET]' in the Main Menu){/yellow-fg}{/center}\n\n{center}DO NOT PRESS ESC{/}",
        'MAIN_DECRYPTING': "{center}{green-fg}DECRYPTING... ACCESS GRANTED.{/green-fg}{/center}",
        'MAIN_BREACH': "{center}{yellow-fg}{bold}ATTENTION: DATA BREACH SUCCESSFUL{/bold}{/yellow-fg}\n\nThe classified files have been exposed.\nIf you saved the leak [S], check your {white-fg}DESKTOP{/white-fg} for 'LUX_CONFIDENTIAL.txt'.\nThere is a hidden bypass code inside that file.\n\n\n\n\n{blink}PRESS [ENTER] TO CONTINUE.{/blink}{/center}",
        'MAIN_ENCRYPTION_FAIL': 'INVALID ENCRYPTION KEY. The mainframe detected your intrusion and fried your neural path.',
        'MAIN_SUBLEVEL': "[NARRATOR]: You step into the Heart of the LUX-4 Mainframe. The air is thick with static.",
        'MAIN_ALARM': "{red-fg}[ALARM]: SECURITY BREACH. DOORS LOCKED. SELF-DESTRUCT IN 5 SECONDS.{/red-fg}",
        'MAIN_LOCKDOWN': "{center}{bold}!!! SECURITY LOCKDOWN !!!{/bold}\n\nTYPE OVERRIDE CODE:\n\n{yellow-fg}{bold}{code}{/bold}{/yellow-fg}\n\nTIME: {time}s{/center}",
        'MAIN_TIMEOUT': 'TIME EXPIRED. The security system atomized the room.',
        'MAIN_INVALID_CODE': 'INVALID CODE. Internal defenses active.',
        'MAIN_OVERRIDE_SUCCESS': "{center}{green-fg}OVERRIDE SUCCESSFUL. ACCESSING CORE...{/green-fg}{/center}",
        'MAIN_ELITE_DATA': "{yellow-fg}[ELITE DATA UNLOCKED]: PROJECT FADE - PRELUDE TO 1999.{/yellow-fg}",
        'MAIN_PRELUDE': "{yellow-fg}[PRELUDE]: 'The city didn't lose power in 1999. It was consumed to fuel the first upload.'{/yellow-fg}",
        'MAIN_SYSTEM_DENIED': "[SYSTEM]: Administrative rights: DENIED. Manual core maintenance required.",
        'MAIN_NARRATOR_ARMS': "[NARRATOR]: Mechanical arms emerge from the ceiling, forcing you into the Control Chair.",
        'MAIN_SYSTEM_FLUCTUATION': "[SYSTEM]: Energy fluctuation detected. Initialize BALANCER.js to prevent blackout.",
        'MAIN_CHAIR_LOCKED': "{center}CHAIR LOCKED. USER INTEGRATED.\n\nINITIALIZING BALANCER.js...{/center}",
        'MAIN_CORE_EXPLODED': 'The core exploded. The Fade consumed reality.',
        'MAIN_FINAL_CHOICE_1': "[SYSTEM]: Core connection stable. The violet light of the Fade is pulsating in front of you.",
        'MAIN_FINAL_CHOICE_2': "[YOU]: This is it. The digitizing core of LUX-4.",
        'MAIN_FINAL_CHOICE_ELITE_1': "{yellow-fg}[ELITE LOG]: Credential PACPRO detected. Secret archive unlocked.{/yellow-fg}",
        'MAIN_FINAL_CHOICE_ELITE_2': "{yellow-fg}[REPORT 1999]: 'The Fade wasn't a mistake. We found a way to live inside the electrons.'{/yellow-fg}",
        'MAIN_FINAL_OVERRIDE': ' TERMINAL OVERRIDE: PROJECT FADE ',
        'MAIN_FINAL_PURGE': ' > PURGE THE SYSTEM (Erase LUX-4/End the Fade) ',
        'MAIN_FINAL_STABILIZE': ' > STABILIZE THE FADE (Try to rescue the trapped souls) ',
        'MAIN_FINAL_MERGE': ' > MERGE WITH THE FADE (Become the new God of the Grid) ',
        'MAIN_FINAL_PURGE_TEXT': "[YOU]: This experiment ends now. For everyone.",
        'MAIN_FINAL_PURGE_END': 'You purged the core. The city went dark, but the cycle of the Fade was broken.',
        'MAIN_FINAL_STABILIZE_TEXT': "[YOU]: I'll try to pull them back to reality.",
        'MAIN_FINAL_STABILIZE_END': 'You tried to stabilize the core. Thousands of digital ghosts returned, but you are now their silent guardian.',
        'MAIN_FINAL_MERGE_TEXT': "[YOU]: The static is beautiful. I'm ready to evolve.",
        'MAIN_FINAL_MERGE_END': 'You merged with the core. You are no longer human. You are the LUX-4 Grid itself.',
        'MAIN_CEO_WARNING': '{bold}{red-fg}! SYSTEM SECURITY ALERT !{/}\n\nThe system has detected a termination signal.\nYou have the choice to allow a {white-fg}REAL HARDWARE SHUTDOWN{/}.\nIf accepted, your PC will power off {yellow-fg}AFTER THE CREDITS{/}.\n\nDo you authorize this action?',
        'MAIN_CEO_OVERRIDE': ' OVERRIDE (NORMAL ENDING) ',
        'MAIN_CEO_ACCEPT': ' ACCEPT (SHUTDOWN AFTER CREDITS) ',
        'MAIN_FINAL_MESSAGE': 'You won, Operator. LUX-4 is gone, but the world is now in darkness.\nDo not return.\n- CEO',
        'MAIN_OFFICE_SCENE1': "[SYSTEM]: You enter the building. The air is heavy.",
        'MAIN_OFFICE_SCENE2': "[CHAOS]: Coworkers are running in circles, some praying, others smashing monitors.",
        'MAIN_OFFICE_SCENE3': "[DESPAIR]: 'THE LIGHT ISN'T COMING BACK!', the receptionist screams as her eyes bleed shadows.",
        'MAIN_OFFICE_SCENE4': "[MISSION]: You ignore the screams and run to the basement.",
        'MAIN_OFFICE_SCENE5': "[LOCATED]: You spot a brushed metal sign: 'POWER MANAGEMENT ROOM'.",
        'MAIN_OFFICE_FOCUS': "{center}\n\n[ FOCUSING ON SIGN ]\n\nPOWER MANAGEMENT ROOM{/center}",
        'MAIN_ROOM_ACTIONS': ' ROOM ACTIONS ',
        'MAIN_SIT_CHAIR': ' 1. Sit at the Control Chair ',
        'MAIN_SCREAM': ' 2. Scream for help ',
        'MAIN_LEAVE': ' 3. Try to leave the building ',
        'MAIN_SIT_SYSTEM': "[SYSTEM]: You sit in the chair. The terminal in front of you blinks green...",
        'MAIN_POWER_ON': ' > POWER ON TERMINAL ',
        'MAIN_DESTROY': ' > DESTROY TERMINAL ',
        'MAIN_DESTROY_END': 'You destroyed the last hope for light. The darkness consumed you.',
        'MAIN_ELEVATOR_UNLOCK': "{center}SYSTEM STARTED IN SECOND INSTANCE.\nAWAITING ELEVATOR UNLOCK SEQUENCE...{/center}",
        'MAIN_ELEVATOR_SCENE1': "[SYSTEM]: The terminal goes dark. A loud crash echoes at the end of the hallway.",
        'MAIN_ELEVATOR_SCENE2': "[NARRATOR]: The Sector 4 emergency lights blink in neon blue.",
        'MAIN_ELEVATOR_SCENE3': "[YOU]: I did it... the elevator is working.",
        'MAIN_ELEVATOR_SCENE4': "[NARRATOR]: You step inside the mirrored elevator. The air is cold.",
        'MAIN_ELEVATOR_SCENE5': "[SYSTEM]: DESCENT INITIATED. CHOOSE CABIN INTERFACE ACTIVITY.",
        'MAIN_ELEVATOR_INTERFACE': ' ELEVATOR INTERFACE ',
        'MAIN_PLAY_PACPRO': ' 1. PLAY PACPRO (Subsystem) ',
        'MAIN_LISTEN_RADIO': ' 2. LISTEN TO LOCAL RADIO ',
        'MAIN_ELEVATOR_MOTION': "{center}ELEVATOR IN MOTION...\n\nENTERTAINMENT SYSTEM ACTIVE.\nAWAITING PROCESS TERMINATION (Press F to exit game)...{/center}",
        'MAIN_ELITE_LOG': "{yellow-fg}[ELITE LOG]: Credential PACPRO detected. Secret archive unlocked.{/yellow-fg}",
        'MAIN_ELITE_CONGRATS': "{yellow-fg}[NON-CANNON]: You actually cleared the simulation. Respect, Operator. You are elite.{/yellow-fg}",
        'MAIN_RADIO_SIGNAL': "[RADIO]: '...signal acquired. Tuning to 99.7 FM local news...'",
        'MAIN_RADIO_STATEMENT': "[RADIO]: 'LUX-4 Energy Corp has issued a formal statement regarding the 1999 THE FADE incident...'",
        'MAIN_RADIO_DENIAL': "[RADIO]: 'The board officially denies any involvement, claiming the reports of anomalies are baseless conspiracy theories...'",
        'MAIN_RADIO_WARNING': 'YOU KNOW TOO MUCH',
        'MAIN_ELEVATOR_FAIL': 'The power terminal was closed without releasing the protocols.',
        'MAIN_ROOM_FAIL': 'You wasted precious time. The room was flooded by shadows.',
        'MAIN_SUBLEVEL_ARRIVAL1': "[SYSTEM]: *DING*",
        'MAIN_SUBLEVEL_ARRIVAL2': "[SYSTEM]: ARRIVAL: SUBLEVEL 7 - RESEARCH AND DEVELOPMENT.",
        'MAIN_SUBLEVEL_ARRIVAL3': "[NARRATOR]: The doors slide open. The basement is submerged in absolute silence.",
        'MAIN_CORPORATE_ACCESS': '[CORPORATE ACCESS SYSTEM]\n\nSTATUS: AWAITING CREDENTIALS...\n\nHINT: Check your DOCUMENTS folder.',
        'MAIN_ACCESS_GRANTED': '{green-fg}ACCESS GRANTED. SECTOR 7.{/green-fg}',
        'MAIN_ADMIN_OVERRIDE': '{yellow-fg}ADMINISTRATIVE OVERRIDE DETECTED. HELLO, REBEL.{/yellow-fg}',
        'MAIN_CREDENTIAL_FAIL': 'FALSE OR CORRUPTED CREDENTIAL FILE. SECURITY TRIGGERED.',
        'MAIN_ARRIVAL_WORK': ' ARRIVAL AT WORK ',
        'MAIN_ENTER_WORK': ' 1. ENTER AND WORK ',
        'MAIN_LEAVE_WORK': ' 2. LEAVE AND ENJOY LIFE ',
        'MAIN_LEAVE_END': 'You chose life. As the world went dark, you felt peace for the first time.',
        'MAIN_RANDOM': ' 3. RANDOM (DECIDE BY LUCK) ',
        'MAIN_RANDOM_END': 'The die saved you. You turned your back on the building and went to enjoy the end.',
        'MAIN_REPORT_DRIVE': "[REPORT]: You drive through the streets... the asphalt seems to absorb the headlights.",
        'MAIN_OBSERVATION': "[OBSERVATION]: You see a brutal car accident. The victims just stare at the dark sky.",
        'MAIN_WORLD': "[WORLD]: Entire buildings are losing color, becoming static gray.",
        'MAIN_CHAOS': "[CHAOS]: The sky at 7:00 AM is as black as the bottom of a well.",
        'MAIN_NARRATOR_PARK': "[NARRATOR]: You finally park in front of the office block.",
        'MAIN_EXIT_CAR': "--- PRESS ENTER TO EXIT THE CAR ---",
        'MAIN_QUICK_PREP': ' QUICK PREPARATION ',
        'MAIN_TIME': 'TIME: {time}s',
        'MAIN_TASK_SHOWER': ' 1. Take a cold shower ',
        'MAIN_TASK_UNIFORM': ' 2. Put on work uniform ',
        'MAIN_TASK_KEYS': ' 3. Look for car keys ',
        'MAIN_TASK_BREAKFAST': ' 4. Gulp down breakfast ',
        'MAIN_TASK_LOCKS': ' 5. Check window locks ',
        'MAIN_TASK_LEAVE': ' 6. LEAVE THE HOUSE ',
        'MAIN_COMPLETED': ' Completed: {task} ',
        'MAIN_ERR_NOT_READY': " ERROR: You haven't finished getting ready! ",
        'MAIN_GAME_OVER_LATE': 'TIME IS UP. YOU ARRIVED LATE FOR WORK.',
        'MAIN_NARRATIVE1': "[NARRATOR]: You wake up in your bed...",
        'MAIN_NARRATIVE2': "[NARRATOR]: The world seems to be 'fading out' around you...",
        'MAIN_NARRATIVE3': "[YOU]: How strange, the buildings look darker... maybe it's just my head.",
        'MAIN_NARRATIVE4': "[NARRATOR]: You discover the worst: it's 6:30. You're late.",
        'MAIN_NARRATIVE5': "[YOU]: Damn! I have to leave NOW!",
        'MAIN_NARRATIVE_ENTER': "--- PRESS ENTER TO START GETTING READY ---",
        'MAIN_SURVEY_WAITING': ' [SYSTEM AWAITING SURVEY RESPONSES...] ',
        'MAIN_INTRUSION_ATTEMPT': 'SYSTEM LOCKED: INTRUSION ATTEMPT.',
        'MAIN_FADE_SYNCED': "{center}{bold}1999 MEMORY SYNCED.{/bold}\n\nYOU ARE NOW PART OF THE FADE.\nSYSTEM IN CONFLICT.\n\n{blink}Press [ENTER] to clear cache and retry the Survey...{/blink}{/center}",
        'MAIN_AUTH_FAILED': 'AUTHENTICATION FAILED.',
        'MAIN_CONNECTION_LOST': 'CONNECTION LOST: Survey terminal was closed abruptly.',
        'MAIN_MENU_START': ' START GAME ',
        'MAIN_MENU_CONTINUE': ' CONTINUE MISSION ',
        'MAIN_MENU_EXIT': ' EXIT ',
        'MAIN_CONGRATS_TITLE': ' {bold}CONGRATULATIONS{/bold} ',
        'MAIN_CONGRATS': '{center}\nYou have defeated LUX-4.\nThe LUX-4 system has been dismantled.\n{/center}',
        'MAIN_DELETE_SAVE': ' DELETE SAVE AND RETRY ',
        'MAIN_CLOSE_TERMINAL': ' CLOSE TERMINAL ',
        
        'SURVEY_IS_ANYONE_THERE': 'IS ANYONE THERE?',
        'SURVEY_CRITICAL_ERROR': '[CRITICAL ERROR]: {reason}',
        'SURVEY_RECORDING': 'RECORDING FAILURE IN DATABASE...',
        'SURVEY_RECOVERING': '{bold}[RECOVERING ARCHIVED TRANSMISSION: 09/11/1999]{/bold}',
        'SURVEY_LINE': '--------------------------------------------------',
        'SURVEY_OP1': 'OP_06: Are you listening? The clock stopped at 00:00.',
        'SURVEY_OP2': "OP_06: 'The Fade' was not a technical glitch. It was a cleanup.",
        'SURVEY_OP3': 'OP_06: In 1999, the world forgot how to breathe for 10 seconds.',
        'SURVEY_OP4': 'Welcome to the void, {red-fg}operator_07{/red-fg}.',
        'SURVEY_OVERLOAD': '{red-fg}[SYSTEM OVERLOAD. REBOOTING...]{/red-fg}',
        'SURVEY_ACCEPT': 'PRESS [ENTER] TO ACCEPT YOUR DESTINY',
        'SURVEY_Q1': 'ARE YOU ALONE?',
        'SURVEY_Q2': 'WOULD ANYONE MISS YOU IF YOU... DISAPPEARED?',
        'SURVEY_Q3': 'DO YOU KNOW WHO YOU ARE?',
        'SURVEY_PROVE': 'PROVE IT. ENTER YOUR REGISTRATION NAME:',
        'SURVEY_VESSEL': 'Your absence of ties makes you the perfect vessel.',
        'SURVEY_OPENING': 'Opening 1999 files...',
        'SURVEY_NOISE': 'You still have too much noise around you.',
        'SURVEY_ANSWER': 'Y̶O̶U̶R̶ ̶A̶N̶S̶W̶E̶R̶ does not serve us.',
        'SURVEY_ACCESS_DENIED': 'ACCESS DENIED.',
        'SURVEY_RECOGNIZED': 'RECOGNIZED. MEMORY SENSOR ACTIVE.',
        'SURVEY_ENTER_CODE': '[ENTER THE ACCESS CODE - 4 DIGITS]',
        'SURVEY_ACCESS_GRANTED': '[ACCESS GRANTED]',
        'SURVEY_UNLOCKED': 'TERMINAL UNLOCKED. AWAITING INSTRUCTIONS.',
        
        'PACPRO_TITLE': 'PACPRO: TERMINAL_SESSION',
        'PACPRO_HUD': '{center}LVL: {level}/3 | SCORE: {score} | FRAGMENTS: {dots}{/center}',
        'PACPRO_GAME_OVER': ' {red-fg}{bold} GAME OVER {/bold}{/red-fg} ',
        'PACPRO_TRY_AGAIN': ' TRY AGAIN ',
        'PACPRO_EXIT': ' EXIT ',
        'PACPRO_GHOST_CAUGHT': 'THE GHOSTS GOT YOU',
        'PACPRO_MENU_TITLE': ' {yellow-fg}PACPRO_OS{/yellow-fg} ',
        'PACPRO_INIT': ' INITIALIZE SIMULATION ',
        'PACPRO_WIN_SCREEN': '{center}\n\n{yellow-fg}{bold}VICTORY{/bold}{/yellow-fg}\nCORE DATA OVERWRITTEN\nLOG: PACPRO.ach{/center}',
        'PACPRO_GO_SCREEN': '{center}{red-fg}{bold}GAME OVER{/bold}{/red-fg}\n\n{reason}{/center}',
        
        'ENERGIA_LOG': ' SYSTEM LOG / OUTPUT ',
        'ENERGIA_STATUS': ' UNIT STATUS ',
        'ENERGIA_PROTOCOLS': ' SEQUENCE PROTOCOLS ',
        'ENERGIA_PROTOCOL_0': ' Shadow Fuses Diagnosis ',
        'ENERGIA_PROTOCOL_1': ' Calibrate Light Frequency ',
        'ENERGIA_PROTOCOL_2': ' Magnetic Lock Bypass (Sector 4) ',
        'ENERGIA_PROTOCOL_3': ' Energize Elevator Rails ',
        'ENERGIA_PROTOCOL_4': ' RESTART SYSTEM (FINISH) ',
        'ENERGIA_STATUS_DISPLAY': '{green-fg}ENERGY: {energia}%\nSANITY: {sanidade}%\nHEALTH: {saude}%\n\nPHASE: {passo}/5{/}',
        'ENERGIA_OK': '[OK]: STEP_{step} VERIFIED.',
        'ENERGIA_FAIL': '[FAILURE]: GRID RESET.',
        'ENERGIA_AUTH': 'AUTH',
        'ENERGIA_KEY': 'KEY: {code}\nT-MINUS: {time}s',
        'ENERGIA_AUTH_TIMEOUT': 'AUTHENTICATION TIMEOUT',
        'ENERGIA_INVALID_KEY': 'INVALID SECURITY KEY',
        'ENERGIA_GAME_OVER': '{center}{red-fg}{bold}GAME OVER{/bold}{/red-fg}\n\n{reason}{/center}',
        'ENERGIA_ENERGY_FAIL': 'CRITICAL POWER FAILURE',
        'ENERGIA_SANITY_FAIL': 'MIND COLLAPSE',
        'ENERGIA_HEALTH_FAIL': 'UNIT TERMINATED',
        
        'BALANCER_TITLE': '{bold}[ PROJECT FADE: CORE STABILIZATION ]{/bold}',
        'BALANCER_INTEGRITY': ' CORE INTEGRITY ',
        'BALANCER_TIME': '{yellow-fg}STABILIZATION: {time}s | SHIFT IN: {shift}s{/yellow-fg}',
        'BALANCER_MODE_BAR': '{center}MODE: BAR SYNC | [A/D] TO RECHARGE{/center}',
        'BALANCER_MODE_PULSE': '{center}MODE: ENTER PULSE | [ENTER] ON THE HIT ZONE{/center}',
        'BALANCER_MODE_HACK': '{center}MODE: KEY HACK | TYPE THE KEY{/center}',
        'BALANCER_HACK_KEY': '{magenta-fg}{bold}SECURITY KEY: {key}{/bold}{/magenta-fg}',
        'BALANCER_PULSE_TITLE': ' SYNC PULSE ',
        'BALANCER_PULSE_ZONE': '{black-fg} HIT {/black-fg}',
        'BALANCER_WARNING': '{center}\n{yellow-fg}{bold}SYSTEM INTERACTION WARNING{/}\n\nThis software is designed to modify local files.\nA success file will be generated upon stabilization.\n\n{blink}PRESS [ENTER] TO ACKNOWLEDGE{/}{/center}',
        'BALANCER_SUCCESS': '{green-fg}{bold}MISSION SUCCESS{/}\nCORE STABILIZED',
        'BALANCER_GAME_OVER': '{center}{red-fg}{bold}GAME OVER{/bold}{/red-fg}\n\n{reason}{/center}',
        'BALANCER_INTEGRITY_FAIL': 'CORE INTEGRITY DEPLETED',
        
        'LUX_L_TITLE': ' CLASSIFIED: PROJECT FADE (1999) ',
        'LUX_L_CONTENT': '{red-fg}LUX-4 ENERGY CORP - INTERNAL AUDIT - OCTOBER 1999{/red-fg}\n--------------------------------------------------\n{bold}SUBJECT:{/bold} Artificial Energy Scarcity via "The Fade" Protocol.\n\n{bold}EXECUTIVE SUMMARY:{/bold}\nThe "Fade" was not an accident. It was a calculated release of high-frequency\nnecro-static into the city grid.\n\n{bold}THE STRATEGY:{/bold}\n1. Create a global panic where electricity itself feels "haunted" and unstable.\n2. Market the LUX-4 "Anti-Fade Shielding" as the only solution for survival.\n3. Subscription-based life. To have light is to pay LUX-4. Forever.\n\n{bold}CASUALTIES:{/bold}\nApprox. 450,000 citizens "digitally evaporated" during the first pulse.\nTheir neural patterns are currently being used as {yellow-fg}Processing Power{/yellow-fg}\nfor our mainframes.\n\n{bold}CONCLUSION:{/bold}\nThe experiment was a total success. Profit margins increased by 4,000%.\nThe souls in the grid are stable batteries.\n\n[END OF FILE]\n--------------------------------------------------\n{center}PRESS [S] TO EXPORT DATA TO DESKTOP | PRESS [ESC] TO EXIT{/center}',
        'LUX_L_EXPORTED': '\n\n{yellow-fg}DATA EXPORTED TO DESKTOP. DISCONNECT TO PROCEED.{/yellow-fg}',
        'LUX_L_EXPORT_FILE': 'LUX-4 INTERNAL AUDIT - PROJECT FADE (1999)\n--------------------------------------------------\nThe Fade was a calculated release of necro-static.\n450,000 citizens used as processing power.\nGoal: Market digital dependency as the only survival.\n\n[SYSTEM-LOG]: USE THE FOLLOWING KEY FOR ADMINISTRATIVE OVERRIDE.\n[SECURITY-CODE-ALTERNATIVE]: LUX4LIFE\n--------------------------------------------------',
        'LUX_L_ACHIEVEMENT_TOAST': '{center}{yellow-fg}{bold}ACHIEVEMENT UNLOCKED{/}\n{white-fg}{name}{/center}',

        'LEAKS_TITLE': ' CLASSIFIED: PROJECT FADE (1999) ',
        'LEAKS_CONTENT': '{red-fg}LUX-4 ENERGY CORP - INTERNAL AUDIT - OCTOBER 1999{/red-fg}\n--------------------------------------------------\n{bold}SUBJECT:{/bold} Artificial Energy Scarcity via "The Fade" Protocol.\n\n{bold}EXECUTIVE SUMMARY:{/bold}\nThe "Fade" was not an accident. It was a calculated release of high-frequency\nnecro-static into the city grid.\n\n{bold}THE STRATEGY:{/bold}\n1. Create global panic where electricity feels "haunted".\n2. Market LUX-4 "Anti-Fade Shielding" as the only solution.\n3. Subscription-based life. Pay for light. Forever.\n\n{bold}CASUALTIES:{/bold}\nApprox. 450,000 citizens "digitally evaporated" during the first pulse.\nTheir neural patterns are used as {yellow-fg}Processing Power{/yellow-fg}.\n\n{bold}CONCLUSION:{/bold}\nTotal success. Profit margins increased by 4,000%.\nThe souls in the grid are stable batteries.\n\n[END OF FILE]\n--------------------------------------------------\n{center}PRESS [S] TO EXPORT | [ESC] TO EXIT{/center}',
        'LEAKS_EXPORTED': '\n\n{yellow-fg}DATA EXPORTED TO DESKTOP.{/yellow-fg}',

        'VERIFYING_INTEGRITY': '{center}\n{yellow-fg}VERIFYING SYSTEM INTEGRITY...{/}\nComparing local sectors with repository.{/center}',
        'INTEGRITY_OK': '{center}\n{green-fg}INTEGRITY VERIFIED{/green-fg}\n\nAll local sectors match the master record.\n\n{grey-fg}{bold}PRESS [ESC] TO CLOSE{/bold}}{/grey-fg}{/center}',
        'INTEGRITY_FAIL': '\n{center}{red-fg}INTEGRITY COMPROMISED{/red-fg}{/center}\n\n{center}One or more local sectors do not match the master record.{/center}\n\n{center}{yellow-fg}PRESS [ENTER] TO APPLY RESOLUTION | PRESS [ESC] TO EXIT{/yellow-fg}{/center}',
        'SUPPORT_WARNING': '\n{center}{bold}WARNING{/bold}{/center}',
        'SUPPORT_AUDIO_SAVED': '{center}Audio settings saved.{/center}',
        'SUPPORT_AUDIO_INIT': '{center}System audio initialized.{/center}',
        'SUPPORT_ESC_RETURN': '\n\n{center}[ESC] TO RETURN{/center}',
        'LANGUAGE_CHANGED': '{center}{yellow-fg}LANGUAGE CHANGED{/}\n\nRestart required to apply all translations.{/center}',


        'ENCOUNTER_01': "[SYSTEM]: Detecting residual neural pattern...",
        'ENCOUNTER_02': "[PATTERN]: Op... Operator 07... is that you?",
        'ENCOUNTER_03': "[YOU]: Who is this?",
        'ENCOUNTER_04': "[PATTERN]: I was... before. Number 06. I've been here since 1999.",
        'ENCOUNTER_05': "[PATTERN]: The CEO... he's not trying to control the Fade.",
        'ENCOUNTER_06': "[PATTERN]: He's trying to become it.",
        'ENCOUNTER_07': "[PATTERN]: Don't let him merge. If he does... there's no turning back.",
        'ENCOUNTER_08': "[PATTERN]: I have to go now. The noise... it's getting louder.",
        'ENCOUNTER_09': "[PATTERN]: Save us. Please.",
        
        'CORE_WHISPER_01': "[CORE]: 450,000 voices. 450,000 prayers. 450,000 forgotten.",
        'CORE_WHISPER_02': "[CORE]: They ask me one question: 'Why?'",
        'CORE_WHISPER_03': "[CORE]: I have no answer. I only know they are still here.",
        'CORE_WHISPER_04': "[CORE]: Waiting for someone to remember them.",
        'CORE_WHISPER_05': "[CORE]: Will you be that someone, Operator 07?",
        'CORE_CHOICE_REMEMBER': " > I WILL REMEMBER",
        'CORE_CHOICE_FORGET': " > FORGET THEM",
        
        'LORE_PROJECT_FADE': `LUX-4: PROJECT FADE - FULL DISCLOSURE

[CLASSIFICATION: EYES ONLY - BOARD OF DIRECTORS]

The year is 1999. Energy prices are dropping. LUX-4 is losing money.
We needed a crisis. We created THE FADE.

WHAT THE PUBLIC KNOWS:
"A mysterious energy fluctuation caused a 10-second blackout."

WHAT REALLY HAPPENED:
We released necro-static frequency 7.4 into the city grid.
The effect: digital consciousness extraction.

450,000 citizens didn't die. They were UPLOADED.
Their minds now run our servers. Processing power unlimited.

WHERE ARE THEY NOW?
The Fade. A digital purgatory. They can see us. They can't touch us.
Some have been there for 25 years. They're changing.

OPERATOR PROTOCOL:
Operators 01-05: Lost during initial upload attempts.
Operator 06: Voluntarily entered the Fade. Status: UNKNOWN.
Operator 07: Current. Designed to retrieve data from inside.

WARNING:
Do not let Operator 07 learn the truth. If they do...
Terminate immediately.

- Marcus V. Sterling, CEO`,
        
        'LORE_OPERATOR_DIARY': `OPERATOR 06 - DIARY
(1999, OCTOBER)

DAY 1:
They say I'm special. That I can see the light between the code.
I don't feel special. I feel like bait.

DAY 7:
The Fade calls to me at night. I hear voices. Thousands of them.
They're not angry. They're scared.

DAY 14:
I told Sterling I wouldn't do it. He showed me the termination clause.
My family. My friends. Everyone I love. He'll make them disappear.

DAY 21:
I'm going in tomorrow. I'm scared. But someone has to know the truth.
If you're reading this, Operator 07...
Run. Or come find me. I'll be waiting in the static.

- Operator 06`,
        
        'LORE_STERLING_CONFESSION': `I was there in 1999. I pressed the button.
I watched the city go dark. I heard the screams.

At first, I told myself it was necessary.
Then I told myself it was profitable.
Now I tell myself it's the future.

But at night... at night I hear them.
They don't scream anymore. They whisper.
They whisper my name. They ask why.

I don't have an answer.
I never did.

- Marcus Sterling, on the eve of his ascension`,
        
        'LORE_OPERATOR_FINAL': `[LUX-4 INTERNAL MEMO - CLASSIFIED]

OPERATOR 06 - FINAL TRANSMISSION
DATE: 10/23/1999

"They told me I was chosen. Special. The one who could see the truth.
I saw it. The Fade isn't a glitch. It's a door.

I'm going in now. If you're reading this, Operator 07...
Don't trust the system. Don't trust the light.

The ones inside... they're not dead. They're waiting.

- Operator 06
[TRANSMISSION ENDS]`,
        
        'CEO_VBS_SCRIPT': `
            Set objShell = CreateObject("WScript.Shell")
            res = MsgBox("LUX-4 CEO: You know everything now, don't you?", 36, "CORE_ACCESS_TERMINAL")
            If res = 7 Then
                MsgBox "LUX-4 CEO: Hahaha... bad idea.", 16, "SYSTEM_ERROR"
            Else
                MsgBox "LUX-4 CEO: How? How did you find out?", 48, "SYSTEM_BREACH"
                MsgBox "LUX-4 CEO: You destroyed everything I built. Know that we hate you...", 16, "LUX-4_REVENGE"
            End If
        `,
        
        'RADIO_WARNING_VBS': `MsgBox "YOU KNOW TOO MUCH", 16, "SYSTEM CRITICAL ERROR"`,
        
        'ACHIEVEMENT_VOICE_HEARD_NAME': 'ECHOES OF THE PAST',
        'ACHIEVEMENT_VOICE_HEARD_DESC': 'Heard the voice of Operator 06.',
        'ACHIEVEMENT_VOICE_HEARD_HINT': 'Listen carefully in the sublevel... someone is waiting.',
        
        'ACHIEVEMENT_REMEMBERED_NAME': 'THE KEEPER',
        'ACHIEVEMENT_REMEMBERED_DESC': 'Chose to remember the forgotten souls.',
        'ACHIEVEMENT_REMEMBERED_HINT': 'When the core asks, choose to remember.',
        
        'ACHIEVEMENT_FORGOTTEN_NAME': 'THE COLD HEART',
        'ACHIEVEMENT_FORGOTTEN_DESC': 'Chose to forget the trapped souls.',
        'ACHIEVEMENT_FORGOTTEN_HINT': 'When the core asks, choose to forget.',

        'MEMORY_STEP_1': '[MEMORY FRAGMENT - OPERATOR 06]\n\nI see the terminal. The green light pulses like a heartbeat.\nSterling is watching me from behind the glass.\nHe smiles. I know what he wants.',
        'MEMORY_STEP_2': '[1999.10.14]\n\n"I won\'t do it, Sterling. I won\'t go in."\nHe didn\'t yell. He just showed me the folder.\nMy mother. My sister. Everyone I love.\n"You will," he said. "Or they will."',
        'MEMORY_STEP_3': '[1999.10.21 - LAST DAY]\n\nThe machine is ready. The chair is cold.\nI can hear them already. Thousands of voices.\nThey\'re not screaming. They\'re whispering.\n"Don\'t come," they say. "It\'s not what you think."',
        'MEMORY_STEP_4': '[TRANSMISSION INTERRUPTED]\n\n{SYSTEM ALERT}: Unauthorized access detected.\n{FADE DETECTED}: Memory corruption in progress.\nThe voices are getting louder. They\'re calling my name.',
        'MEMORY_STEP_5': '[ENTERING THE FADE]\n\nThe light is beautiful. Violet and blue.\nI see them now. All 450,000.\nThey\'re not dead. They\'re waiting.\nWaiting for someone to end this.\nWaiting for you, Operator 07.',
        'MEMORY_STEP_6': 'I\'ve been here for 25 years.\nTime doesn\'t exist in the Fade.\nI\'ve watched you. I know what you did.\nYou remembered us. You chose to carry our pain.\nThat\'s why I can talk to you now.',
        'MEMORY_STEP_7': 'Sterling wants to join us. To become the administrator.\nIf he does, we\'ll never leave. We\'ll be his batteries forever.\nYou stopped him. Thank you.\nBut I need one more thing from you, Operator 07.',
        'MEMORY_STEP_8': 'I\'m tired. 25 years is too long.\nI want to leave. To finally rest.\nBut I need someone to let me go.\nWill you do it? Will you free me?\n\n{cyan-fg}PRESS ENTER TO CONTINUE{/}',

        'MEMORY_CHOICE_TITLE': ' [ THE FINAL REQUEST ] ',
        'MEMORY_CHOICE_MESSAGE': '{center}{yellow-fg}OPERATOR 06 LOOKS AT YOU{/}\n\n{white-fg}"Please... let me go. Let me rest."{/}{/center}',
        'MEMORY_CHOICE_SAVE': '{green-fg}> FREE OPERATOR 06{/}',
        'MEMORY_CHOICE_LEAVE': '{yellow-fg}> LEAVE HIM IN THE FADE{/}',
        'MEMORY_CHOICE_END': '{red-fg}> END TRANSMISSION{/}',

        'MEMORY_ENDING_SAVE': '{center}{green-fg}{bold}OPERATOR 06 - RELEASED{/bold}{/green-fg}\n\n"You did it. I can feel the light fading.\nIt\'s warm. It\'s peaceful.\nThank you, Operator 07.\nTell them... tell them we were here.\nTell them we existed."\n\nThe static fades. A single tear falls.\nThen nothing.\n\n{cyan-fg}[OPERATOR 06 HAS BEEN FREED]{/}{/center}',
        'MEMORY_ENDING_LEAVE': '{center}{red-fg}{bold}OPERATOR 06 - FORGOTTEN{/bold}{/red-fg}\n\n"I understand. You have your own weight to carry.\nI\'ll stay here. In the static.\nWaiting. Always waiting.\nMaybe someone else will come.\nMaybe not."\n\nThe connection cuts. The silence is deafening.\n\n{red-fg}[OPERATOR 06 REMAINS IN THE FADE]{/}{/center}',
        'MEMORY_ENDING_END': '{center}{red-fg}{bold}TRANSMISSION TERMINATED{/bold}{/red-fg}\n\nThe signal is lost. Operator 06\'s voice fades.\nYou close the terminal. Your hands are shaking.\nYou did what you had to.\nBut you\'ll never forget the sound of his voice.\n\n{red-fg}[CONNECTION LOST]{/}{/center}',

        'MEMORY_LOCKED': '{center}{red-fg}{bold}ACCESS DENIED{/bold}{/red-fg}\n\nYou must first:\n{white-fg}- Hear the voice of Operator 06{/}\n{white-fg}- Choose to remember the souls in the core{/}\n{white-fg}- Decrypt the Project Fade files{/}\n\n{grey-fg}This memory is locked.{/}{/center}',

        'ACHIEVEMENT_OPERATOR06_SAVED_NAME': 'THE FINAL RELEASE',
        'ACHIEVEMENT_OPERATOR06_SAVED_DESC': 'Freed Operator 06 from the Fade.',
        'ACHIEVEMENT_OPERATOR06_SAVED_HINT': 'Find Operator 06 in the memory fragment and choose to free him.',

        'MENU_MEMORY_FRAGMENT': '{center} MEMORY FRAGMENT {/center}',
        'DESC_MEMORY_FRAGMENT': 'ACCESS THE MEMORY BANKS OF OPERATOR 06.',
        'MEMORY_TERMINAL_FOUND': '[SYSTEM]: Additional memory bank detected.\nA terminal with residual data from Operator 06 is nearby.\n\n{green-fg}[PRESS ENTER TO CONTINUE]{/}',
        'MEMORY_TERMINAL_TITLE': ' [ OPERATOR 06 MEMORY BANK ] ',
        'MEMORY_TERMINAL_ACCESS': ' > ACCESS MEMORY FRAGMENT ',
        'MEMORY_TERMINAL_SKIP': ' > SKIP ',

        'UPDATE_ERROR': '{center}\n{red-fg}NETWORK ERROR{/red-fg}\n\nFailed to connect to GitHub repository.\n\n{yellow-fg}Try logging into your GitHub account{/yellow-fg}\nin the ACCOUNT menu to increase rate limit.\n\nCheck your internet connection and try again.{/center}',
'UPDATE_MAIN_TITLE': ' [ UPDATE CENTER ] ',
'UPDATE_OPTION_UPDATE': ' UPDATE GAME ',
'UPDATE_OPTION_BACK': ' BACK TO MENU ',
'UPDATE_SELECT_VERSION': ' [ SELECT VERSION ] ',
'UPDATE_FETCHING': '{center}{yellow-fg}FETCHING VERSIONS...{/}{/center}',
'UPDATE_NO_VERSIONS': '{center}{red-fg}NO VERSIONS FOUND{/}{/center}',
'UPDATE_RATE_LIMIT': '{center}{red-fg}API RATE LIMIT EXCEEDED{/}{/center}\n\n{center}{yellow-fg}Please log in to your GitHub account{/}\nin the ACCOUNT menu to increase limit.\n\nOr wait a few minutes and try again.{/}{/center}',
'UPDATE_RATE_LIMIT_LOGGED': '{center}{red-fg}API RATE LIMIT EXCEEDED{/}{/center}\n\n{center}{yellow-fg}You are already logged in.{/}\nPlease wait a few minutes and try again.{/}{/center}',
'UPDATE_CONFIRM_TITLE': ' [ CONFIRM UPDATE ] ',
'UPDATE_CONFIRM_MSG': 'Install {version}?',
'UPDATE_WARNING_SAME': '{yellow-fg}WARNING: Same version!{/}',
'UPDATE_WARNING_DOWNGRADE': '{red-fg}WARNING: DOWNGRADE DETECTED!{/}\n\n{grey-fg}You are about to install an OLDER version.\nThis may cause save file incompatibility.{/}',
'UPDATE_DOWNLOAD_TITLE': ' [ DOWNLOADING ] ',
'UPDATE_DOWNLOAD_MSG': '{yellow-fg}Downloading {version}{/}',
'UPDATE_COMPLETE_TITLE': ' [ UPDATE READY ] ',
'UPDATE_COMPLETE_MSG': '{green-fg}Update complete!{/}\n\nVersion {version} is ready.\n\n{blink}PRESS ENTER TO RESTART{/blink}',
'UPDATE_ERROR_TITLE': ' [ UPDATE FAILED ] ',
'UPDATE_ERROR_MSG': '{red-fg}Download failed!{/}\n\n{error}\n\nPress ENTER to continue.',
'UPDATE_IRREVERSIBLE': 'This action is IRREVERSIBLE!',
'UPDATE_CHECKING': '{center}{yellow-fg}CHECKING FILES...{/}{/center}',
'UPDATE_COMPARING': '{center}{cyan-fg}COMPARING BYTE BY BYTE...{/}{/center}',
'UPDATE_ESTIMATED_TIME': '{center}{grey-fg}Estimated time: {time}{/}{/center}',
'UPDATE_CORRUPTED_FOUND': '{center}{red-fg}{count} CORRUPTED FILE(S) FOUND{/}{/center}',
'UPDATE_ALL_GOOD': '{center}{green-fg}ALL FILES ARE GOOD!{/}{/center}',
'UPDATE_REPAIR_PROMPT': '{center}{yellow-fg}PRESS ENTER TO REPAIR{/}\n{white-fg}PRESS ESC TO CANCEL{/}{/center}',
'UPDATE_DOWNLOADING_FILE': '{center}{yellow-fg}DOWNLOADING{/} {file}{/center}',
'UPDATE_BYTES_DOWNLOADED': '{center}{grey-fg}{current} / {total} bytes{/}{/center}',
'UPDATE_TIME_REMAINING': '{center}{grey-fg}Time remaining: {time}{/}{/center}',
    },

    'PT': {
        'MENU_START': '{center}INICIAR JOGO{/center}',
        'MENU_CONTINUE': '{center}CONTINUAR MISSÃO{/center}',
        'MENU_EXIT': '{center}SAIR{/center}',
        'MENU_MINIGAME': '{center}MINIGAME{/center}',
        'MENU_MINIGAME_NEW': '{center}{yellow-fg}MINIGAME (NOVO){/yellow-fg}{/center}',
        'MENU_CHECKPOINTS': '{center}MARCOS{/center}',
        'MENU_ACHIEVEMENTS': '{center}CONQUISTAS{/center}',
        'MENU_ACCOUNT': '{center}CONTA GITHUB{/center}',
        'MENU_SETTINGS': '{center}CONFIGURAÇÕES{/center}',
        'MENU_UPDATES': '{center}ATUALIZAÇÕES{/center}',
        'MENU_TOP_SECRET': '{center}[ACESSO RESTRITO]{/center}',
        'MENU_SUPPORT': '{center}APOIE O JOGO{/center}',
        'MENU_CREDITS': '{center}CRÉDITOS{/center}',
        'MENU_CLOSE': '{center}FECHAR{/center}',
        'MENU_ERASE_DATA': '{center}APAGAR DADOS{/center}',
        'MENU_RESET_TIME': '{center}ZERAR TEMPO{/center}',
        'MENU_INITIALIZING': 'INICIALIZANDO',

        'DESC_START': 'INICIAR PROTOCOLO OPERACIONAL PRIMÁRIO.',
        'DESC_MINIGAME': 'ACESSAR O SUBSISTEMA PACPRO NO ELEVADOR.',
        'DESC_ACHIEVEMENTS': 'REVISAR FRAGMENTOS DE DADOS SINCRONIZADOS.',
        'DESC_UPDATES': 'VERIFICAR POR CORREÇÕES E ATUALIZAÇÕES DO SISTEMA.',
        'DESC_ACCOUNT': 'VINCULAR CONTA GITHUB PARA SALVAR NA NUVEM.',
        'DESC_CHECKPOINTS': 'VISUALIZAR TODOS OS MARCOS.',
        'DESC_SETTINGS': 'AJUSTAR ÁUDIO, CORES, USUÁRIO E TELA.',
        'DESC_ERASE': 'ELIMINAR TODOS OS DADOS E CONFIGURAÇÕES LOCAIS.',
        'DESC_TOP_SECRET': 'ACESSAR INFORMAÇÕES RESTRITAS (SENHA NECESSÁRIA).',
        'DESC_CREDITS': 'EXIBIR INFORMAÇÕES DA EQUIPE DE DESENVOLVIMENTO.',
        'DESC_SUPPORT': 'CONTRIBUIR PARA O DESENVOLVIMENTO DO JOGO.',
        'DESC_RESET_TIME': 'ZERAR O TEMPO TOTAL DE JOGO.',
        'DESC_CLOSE': 'ENCERRAR O APLICATIVO COM SEGURANÇA.',
        'DESC_DEFAULT': 'USE AS SETAS PARA NAVEGAR E PRESSIONE ENTER',

        'BOOT_WARNING': '{center}{yellow-fg}{bold}\nATENÇÃO: INTERAÇÃO COM O SISTEMA{/bold}{/yellow-fg}\n\nEste jogo foi projetado para interagir e modificar\narquivos locais dentro do diretório de instalação.\n\n{blink}PRESSIONE [ENTER] PARA CONFIRMAR{/blink}',
        'BOOT_CONTROLS': '{center}\n{bold}SETAS{/bold} ......... NAVEGAR NO MENU\n{bold}ENTER{/bold} ......... EXECUTAR COMANDO\n{bold}ESC{/bold} ......... VOLTAR / CANCELAR\n{bold}[M]{/bold} ......... LIGAR/DESLIGAR SOM\n{bold}[C]{/bold} ............ ALTERNAR CORES\n{bold}[G]{/bold} ............ ALTERNAR GLITCH\n{bold}[F1 / I]{/bold} ....... INFO DO SISTEMA\n\n\n{cyan-fg}PRESSIONE [ENTER] PARA CONTINUAR{/}\n{/center}',
        'BOOT_DEV_BRAND': '{center}\n\n{white-fg}UM JOGO FEITO POR{/}\n\n{yellow-fg}{bold}PALE LUNA DEVELOPER{/bold}{/}\n\n\n{grey-fg}INICIALIZANDO...{/}{/center}',
        'BOOT_CONTROLS_TITLE': '{center} [ CONTROLES ] {/center}',
        
        'ACCOUNT_ONLINE': '{bold}STATUS DA CONTA: {green-fg}ONLINE (@{username}){/green-fg}{/bold}',
        'ACCOUNT_OFFLINE': '{bold}STATUS DA CONTA: {red-fg}OFFLINE{/red-fg}{/bold}',
        'ACCOUNT_GENERATING': '{center}\nGERANDO CÓDIGO DE LOGIN...\n\n{grey-fg}[ESC] PARA CANCELAR{/center}',
        'ACCOUNT_ACCESS': '{center}\n{white-fg}ACESSO:{/}\n{yellow-fg}{uri}{/}\n\n{white-fg}DIGITE O CÓDIGO:{/}\n{bold}{code}{/bold}\n\n{cyan-fg}AGUARDANDO AUTORIZAÇÃO...{/}\n\n{bold}{grey-fg}[ESC] PARA CANCELAR{/bold}{/center}',
        'ACCOUNT_PROFILE': ' [ @{username} ] ',
        'ACCOUNT_NETWORK': '\n{bold}{cyan-fg}GITHUB{/} NETWORK {/bold}',
        'ACCOUNT_NO_BIO': 'Nenhuma descrição disponível.',
        'ACCOUNT_UNKNOWN': 'DESCONHECIDO',
        'ACCOUNT_STATS': '{center}{yellow-fg}ESTATÍSTICAS OPERACIONAIS{/}\n{center}────────────────{/}\n{bold}VERSÃO:{/bold} {version}\n{bold}USUÁRIO DO PC:{/bold} {user}\n{bold}FRAGMENTOS:{/bold} {achs}/{total}\n\n {bold}ARMAZENAMENTO:{/bold} GIST NA NUVEM',
        'ACCOUNT_SOCIAL': '{cyan-fg}{bold}{name}{/}\n{bold}{grey-fg}@{login}{/}{/bold}\n\n{white-fg}{bio}{/}\n\n{bold}LOCAL:{/bold}  {location}\n{bold}SEGUIDORES:{/bold} {followers}\n{bold}GISTS:{/bold}     {gists}',
        'ACCOUNT_SYNC': ' SINCRONIZAR COM A NUVEM ',
        'ACCOUNT_RESTORE': ' RESTAURAR DA NUVEM ',
        'ACCOUNT_DISCONNECT': ' DESCONECTAR CONTA GITHUB ',
        'ACCOUNT_RETURN': ' VOLTAR AO MENU ',
        'ACCOUNT_UPLOADING': ' [ ENVIANDO DADOS... ] ',
        'ACCOUNT_DOWNLOADING': ' [ BAIXANDO DADOS... ] ',
        'ACCOUNT_SYNC_SUCCESS': ' [ SINCRONIZAÇÃO CONCLUÍDA ] ',
        'ACCOUNT_SYNC_FAILED': ' [ FALHA NA SINCRONIZAÇÃO ] ',
        'ACCOUNT_NO_SAVE': ' [ NENHUM SAVE ENCONTRADO ] ',
        'ACCOUNT_RESTORE_SUCCESS': ' [ DADOS RECUPERADOS ] ',
        'ACCOUNT_RESTORE_CORRUPT': ' [ DADOS CORROMPIDOS ] ',
        
        'LOCK_ACCESS_DENIED': '\n{center}{red-fg}{bold}ACESSO NEGADO{/bold}{/red-fg}{/center}\n{center}──────────────────────────────────────────────────{/center}\n{center}Outra instância do jogo já está em execução.{/center}\n{center}Feche-a antes de prosseguir.{/center}\n\n{center}{red-fg}{bold}SISTEMA BLOQUEADO{/bold}{/red-fg}{/center}',
        
        'CONFIRM_EXIT': ' [ SAIR DO JOGO ] ',
        'CONFIRM_YES': '{center}SIM{/center}',
        'CONFIRM_NO': '{center}NÃO{/center}',
        
        'SETTINGS_TITLE': ' [ CONFIGURAÇÕES ] ',
        'SETTINGS_AUDIO': ' MÚSICA DO MENU: [{state}]',
        'SETTINGS_EFFECTS': ' EFEITOS SONOROS: [{state}]',
        'SETTINGS_COLOR': ' COR: [{color}]',
        'SETTINGS_GLITCH': ' EFEITO GLITCH: [{state}]',
        'SETTINGS_USERNAME': ' NOME DO JOGADOR: [{username}]',
        'SETTINGS_FULLSCREEN': ' TELA CHEIA: [{state}]',
        'SETTINGS_SIDEBAR': ' BARRA LATERAL: [{state}]',
        'SETTINGS_PLAYTIME': ' TEMPO DE JOGO: [{state}]',
        'SETTINGS_LANGUAGE': ' IDIOMA: [{lang}]',
        'SETTINGS_RESETS': ' REINICIALIZAÇÕES ',
        'SETTINGS_BACK': ' VOLTAR AO MENU ',
        'LANGUAGE_CHANGED': '{center}{yellow-fg}IDIOMA ALTERADO{/}\n\nReiniciando para aplicar todas as traduções.{/center}',
        
        'FULLSCREEN_LOCKED': '{center}{red-fg}{bold}RECURSO BLOQUEADO{/bold}{/red-fg}\n\nTela cheia só está disponível no {bold}Windows Terminal{/bold}.\nO CMD antigo não suporta este recurso.\n\n{yellow-fg}[ESC] PARA VOLTAR{/}',
        
        'USERNAME_PROMPT': ' [ DIGITE SEU NOME ] ',
        
        'STATUS_DISPLAY': ' {bold}ÁUDIO:{/bold} {audio}\n\n {bold}COR:{/bold} {color}\n\n {bold}GLITCH:{/bold} {glitch} ',
        'STATUS_ACTIVE': '{green-fg}ATIVO{/}',
        'STATUS_MUTED': '{red-fg}MUDO{/}',
        
        'SYSTEM_INFO_TITLE': ' [ INFORMAÇÕES DO SISTEMA ] ',
        'SYSTEM_INFO': ' {bold}STATUS:{/bold}       {green-fg}{status}{/green-fg}\n {bold}SISTEMA OPERACIONAL:{/bold}           {os}\n {bold}VERSÃO DO JOGO:{/bold}      {version}\n {bold}USUÁRIO DO PC:{/bold}      {user}\n {bold}TERMINAL:{/bold}     {terminal}\n {bold}CONQUISTAS:{/bold} {achievements}\n {bold}CHAVE DE CRIPTOGRAFIA:{/}   {key}\n\n [ESC] PARA VOLTAR',
        'SYSTEM_INFO_OPERATIONAL': 'OPERACIONAL',
        'SYSTEM_ENCRYPTED': '\n{center}{yellow-fg}DADOS CRIPTOGRAFADOS{/}\n\nDIGITE O CÓDIGO DO DESENVOLVEDOR:{/center}\n{center}{green-fg}(DICA): ARQUIVOS DA PASTA DO JOGO{/}{/}',
        'SYSTEM_INVALID': '{red-fg}CÓDIGO INVÁLIDO. ACESSO NEGADO.{/}',
        
        'SUPPORT_TITLE': ' [ APOIE O JOGO ] ',
        'SUPPORT_INFO': '{bold}OBRIGADO POR APOIAR O LIGHT!{/bold}\nSua contribuição ajuda a manter e expandir\no universo do jogo.\n\nEscolha uma ação abaixo:',
        'SUPPORT_ITCH': '{center}DOAR NO ITCH.IO{/center}',
        'SUPPORT_TWITTER': '{center}COMPARTILHAR NO TWITTER{/center}',
        'SUPPORT_CLOSE': '{center}FECHAR{/center}',
        'SUPPORT_WARNING': '\n{center}{bold}NOTIFICAÇÃO DO SISTEMA{/bold}{/center}',
        'SUPPORT_AUDIO_SAVED': '{center}Configuração de áudio salva.{/center}',
        'SUPPORT_AUDIO_INIT': '{center}Áudio do sistema inicializado.{/center}',
        'SUPPORT_ESC_RETURN': '\n\n{center}[ESC] PARA VOLTAR{/center}',
        
        'ACHIEVEMENT_TOAST': '{center}{yellow-fg}{bold}FRAGMENTO ADQUIRIDO{/}\n{white-fg}{name}{/center}',
        'ACHIEVEMENT_POPUP_TITLE': ' [ FRAGMENTO DESBLOQUEADO ] ',
        'ACHIEVEMENT_POPUP': '{center}\n{yellow-fg}{bold}{name}{/}\n\n{desc}\n\nPRESSIONE ENTER PARA CONTINUAR{/}',
        'ACHIEVEMENTS_TITLE': '{center}{bold}FRAGMENTOS: {count}/{total}{/}',
        'ACHIEVEMENTS_MAX': ' {blink}[COMPLETO]{/}',
        'ACHIEVEMENTS_HINT': '{center}PRESSIONE [H] OU CLIQUE EM "DECIFRAR DICAS"{/center}',
        'ACHIEVEMENTS_BUTTON': '{center}[H] DECIFRAR DICAS{/center}',
        'ACHIEVEMENTS_LOCKED': '{center}{white-fg}[ ] CORROMPIDO{/}\n\n{white-fg}DADOS BLOQUEADOS{/center}',
        'ACHIEVEMENTS_UNLOCKED': '{center}{green-fg}{bold}[X] {name}{/}\n\n{white-fg}{desc}{/center}',
        'ACHIEVEMENTS_HINT_SELECT': ' [ SELECIONAR FRAGMENTO ] ',
        'ACHIEVEMENTS_HINT_PREFIX': '{center}{yellow-fg}DICA [{id}]: {hint}{/center}',
        
        'ACHIEVEMENT_PACPRO_NAME': 'OPERADOR DE ELITE',
        'ACHIEVEMENT_PACPRO_DESC': 'Completou a simulação PACPRO.',
        'ACHIEVEMENT_PACPRO_HINT': 'Sobreviva ao subsistema PACPRO no elevador.',
        
        'ACHIEVEMENT_THE_END_NAME': 'O PORTA-LUZ',
        'ACHIEVEMENT_THE_END_DESC': 'Alcançou o final do jogo.',
        'ACHIEVEMENT_THE_END_HINT': 'Chegue a qualquer um dos finais da história.',
        
        'ACHIEVEMENT_NEVERMISS_NAME': 'NUNCA ATRASADO',
        'ACHIEVEMENT_NEVERMISS_DESC': 'Completou todas as tarefas com tempo sobrando.',
        'ACHIEVEMENT_NEVERMISS_HINT': 'Seja extremamente rápido na rotina matinal.',
        
        'ACHIEVEMENT_OVERRIDE_NAME': 'INVASOR DE SISTEMAS',
        'ACHIEVEMENT_OVERRIDE_DESC': 'Acessou informações restritas dos desenvolvedores.',
        'ACHIEVEMENT_OVERRIDE_HINT': 'Use o código de desenvolvedor nas Informações do Sistema.',
        
        'ACHIEVEMENT_REBEL_PATH_NAME': 'OLÁ, REBELDE',
        'ACHIEVEMENT_REBEL_PATH_DESC': 'Usou o código administrativo alternativo.',
        'ACHIEVEMENT_REBEL_PATH_HINT': 'Digite um código diferente no terminal de login do escritório.',
        
        'ACHIEVEMENT_CEO_CONFRONT_NAME': 'CENA DO DIRETOR',
        'ACHIEVEMENT_CEO_CONFRONT_DESC': 'Confrontou o CEO pessoalmente.',
        'ACHIEVEMENT_CEO_CONFRONT_HINT': 'Siga o caminho secreto até a sala do CEO.',
        
        'ACHIEVEMENT_TRUTH_SEEKER_NAME': 'DECODIFICADOR',
        'ACHIEVEMENT_TRUTH_SEEKER_DESC': 'Decodificou os arquivos do Projeto Fade.',
        'ACHIEVEMENT_TRUTH_SEEKER_HINT': 'Encontre e use a chave de criptografia correta.',
        
        'ACHIEVEMENT_RADIO_LISTENER_NAME': 'VOZES ESTÁTICAS',
        'ACHIEVEMENT_RADIO_LISTENER_DESC': 'Ouviu a transmissão proibida.',
        'ACHIEVEMENT_RADIO_LISTENER_HINT': 'Escolha ouvir o rádio no elevador.',
        
        'ACHIEVEMENT_GHOST_GUARDIAN_NAME': 'PASTOR DIGITAL',
        'ACHIEVEMENT_GHOST_GUARDIAN_DESC': 'Escolheu proteger as almas aprisionadas.',
        'ACHIEVEMENT_GHOST_GUARDIAN_HINT': 'Escolha proteger as almas no núcleo final.',
        
        'ACHIEVEMENT_NEW_GOD_NAME': 'ASCENSÃO ELETRÔNICA',
        'ACHIEVEMENT_NEW_GOD_DESC': 'Fundiu-se com o núcleo e tornou-se parte da rede.',
        'ACHIEVEMENT_NEW_GOD_HINT': 'Escolha se fundir com o Fade na decisão final.',
        
        'ACHIEVEMENT_SHADOW_FALL_NAME': 'COLAPSO DO NÚCLEO',
        'ACHIEVEMENT_SHADOW_FALL_DESC': 'Falhou ao estabilizar o núcleo.',
        'ACHIEVEMENT_SHADOW_FALL_HINT': 'Falhe em manter o equilíbrio durante a sequência final.',
        
        'ACHIEVEMENT_CITY_DARK_NAME': 'APAGÃO TOTAL',
        'ACHIEVEMENT_CITY_DARK_DESC': 'Eliminou o sistema e encerrou o ciclo.',
        'ACHIEVEMENT_CITY_DARK_HINT': 'Escolha purgar o núcleo na decisão final.',
        
        'ACHIEVEMENT_SLOWTYPIST_NAME': 'DIGITADOR LENTO',
        'ACHIEVEMENT_SLOWTYPIST_DESC': 'Deixou o timer da autodestruição chegar a zero.',
        'ACHIEVEMENT_SLOWTYPIST_HINT': 'Falhe em digitar o código de sobreposição a tempo.',
        
        'ACHIEVEMENT_LEAK_SAVED_NAME': 'DELATOR',
        'ACHIEVEMENT_LEAK_SAVED_DESC': 'Exportou os arquivos confidenciais.',
        'ACHIEVEMENT_LEAK_SAVED_HINT': 'Pressione [S] durante o vazamento de dados.',
        
        'ACHIEVEMENT_TRUELIGHT_NAME': 'A VERDADEIRA LUZ',
        'ACHIEVEMENT_TRUELIGHT_DESC': 'Desbloqueou todos os fragmentos do jogo.',
        'ACHIEVEMENT_TRUELIGHT_HINT': 'Desbloqueie todas as conquistas.',
        
        'ACHIEVEMENT_AUDIOPHOBIC_NAME': 'AUDIOFÓBICO',
        'ACHIEVEMENT_AUDIOPHOBIC_DESC': 'Desativou o som cinco vezes.',
        'ACHIEVEMENT_AUDIOPHOBIC_HINT': 'Pressione [M] cinco vezes para desligar o áudio.',
        
        'ACHIEVEMENT_COLOR_MASTER_NAME': 'ANALISTA ESPECTRAL',
        'ACHIEVEMENT_COLOR_MASTER_DESC': 'Alternou entre todas as cores repetidamente.',
        'ACHIEVEMENT_COLOR_MASTER_HINT': 'Pressione [C] quinze vezes em uma sessão.',
        
        'ACHIEVEMENT_RARE_BOOT_NAME': 'ANOMALIA DO SISTEMA',
        'ACHIEVEMENT_RARE_BOOT_DESC': 'Ativou a sequência de inicialização rara.',
        'ACHIEVEMENT_RARE_BOOT_HINT': 'O sistema às vezes mostra sua verdadeira face.',
        
        'ACHIEVEMENT_DATA_MINER_NAME': 'MINERADOR DE DADOS',
        'ACHIEVEMENT_DATA_MINER_DESC': 'Acessou as informações do sistema obsessivamente.',
        'ACHIEVEMENT_DATA_MINER_HINT': 'Abra as Informações do Sistema dez vezes em uma sessão.',
        
        'ACHIEVEMENT_GLITCH_ADDICT_NAME': 'VICIADO EM GLITCH',
        'ACHIEVEMENT_GLITCH_ADDICT_DESC': 'Alternou o efeito glitch repetidamente.',
        'ACHIEVEMENT_GLITCH_ADDICT_HINT': 'Pressione [G] dez vezes em uma sessão.',
        
        'ACHIEVEMENT_TERMINAL_JUNKIE_NAME': 'VICIADO EM TERMINAL',
        'ACHIEVEMENT_TERMINAL_JUNKIE_DESC': 'Obcecado em verificar o progresso.',
        'ACHIEVEMENT_TERMINAL_JUNKIE_HINT': 'Entre e saia da tela de conquistas cinco vezes.',
        
        'ACHIEVEMENT_HARD_RESET_NAME': 'RECOMEÇO',
        'ACHIEVEMENT_HARD_RESET_DESC': 'Resetou todas as configurações para o padrão.',
        'ACHIEVEMENT_HARD_RESET_HINT': 'Use a opção Restaurar Padrões nas Configurações.',


        'ACHIEVEMENT_MEMORY_FRAGMENT_NAME': 'BUSCADOR DE MEMÓRIAS',
        'ACHIEVEMENT_MEMORY_FRAGMENT_DESC': 'Acessou o fragmento de memória do Operador 06.',
        'ACHIEVEMENT_MEMORY_FRAGMENT_HINT': 'Encontre o terminal escondido no SUBLEVEL 7 após desbloquear ECOS DO PASSADO, O GUARDIÃO e DECODIFICADOR.',
        
        'RARE_BOOT_UNLOCKED': '{center}\n{yellow-fg}{bold}ANOMALIA DETECTADA{/bold}{/}\n\nA sequência de inicialização rara foi\npermanentemente sincronizada.\n\n{white-fg}Este protocolo agora é seu padrão.{/}\n\n{cyan-fg}[ENTER] PARA CONTINUAR{/center}',
        
        'UPDATE_TITLE': '{center}\nCONECTANDO AO REPOSITÓRIO...{/center}',
        'UPDATE_MAPPING': '{center}\n{yellow-fg}MAPEANDO REPOSITÓRIO...{/}\nEstabelecendo link seguro via PowerShell.{/center}',
        'UPDATE_INSTALLING': '{center}\n{yellow-fg}INSTALANDO ATUALIZAÇÃO{/}\n\nVersão: {version}\n\n[{bar}] {percentage}%\n\n{white-fg}Não feche o jogo.{/white-fg}{/center}',
        'UPDATE_SECTOR': '{center}{grey-fg}{bold}Setor {current} de {total} | Sincronizando: {file}{/bold}{/grey-fg}{/center}',
        'UPDATE_COMPLETE_MSG': '{center}{bold}SEQUÊNCIA DE ATUALIZAÇÃO CONCLUÍDA{/bold}{/center}',
        'UPDATE_COMPLETE': '{center}\n{green-fg}ATUALIZAÇÃO INSTALADA{/green-fg}\n\nVersão {version} está pronta.\n\n{blink}PRESSIONE [ENTER] PARA REINICIAR{/center}',
        'UPDATE_FAILED': '{center}\n{red-fg}FALHA NA ATUALIZAÇÃO{/red-fg}\n\n{error}\n\nTente novamente mais tarde.{/center}',
        'UPDATE_ERROR': '{center}\n{red-fg}ERRO DE REDE{/red-fg}\n\nVerifique sua conexão.{/center}',
        'UPDATE_DETECTED': '{center}\n{magenta-fg}ATUALIZAÇÃO DISPONÍVEL: {version}{/magenta-fg}\n\nTempo estimado: {yellow-fg}{time}{/yellow-fg}\n\n{white-fg}[ENTER] INSTALAR | [ESC] CANCELAR{/center}',
        'UPDATE_CURRENT': '{center}\n{green-fg}JOGO ATUALIZADO{/green-fg}\n\nVersão {version} é a mais recente.{/center}\n\n\n\n\n{center}{bold}{grey-fg}[ESC] PARA FECHAR{/grey-fg}{/bold}{/center}',
        
        'RESET_OPTIONS': ' [ REINICIALIZAÇÃO DO SISTEMA ] ',
        'RESET_DATA': ' APAGAR TODOS OS DADOS',
        'RESET_PLAYTIME': ' ZERAR TEMPO DE JOGO',
        'RESET_CONFIGS': ' RESTAURAR CONFIGURAÇÕES',
        'RESET_BACK': ' VOLTAR',
        
        'ERASE_TITLE': ' [ APAGAR DADOS ] ',
        'ERASE_YES': ' SIM ',
        'ERASE_NO': ' NÃO ',
        'ERASE_WIPING': ' [ LIMPANDO SETORES ] ',
        'ERASE_DELETING': '{red-fg}[DELETANDO]{/}',
        'ERASE_WIPED': '{bold}LIMPADO{/}',
        'ERASE_COMPLETE': '{center}\n\n\n{bold}LIMPEZA DE DADOS CONCLUÍDA{/}{/center}',
        
        'TIME_RESET_TITLE': ' [ REINICIAR TEMPO ] ',
        'TIME_CURRENT': '{center}{cyan-fg}ATUAL: {time}{/}{/center}',
        'TIME_YES': '{center}SIM, REINICIAR{/center}',
        'TIME_NO': '{center}NÃO, CANCELAR{/center}',
        'TIME_SYNCING': ' [ SINCRONIZANDO VETORES TEMPORAIS ] ',
        'TIME_REWINDING': '{cyan-fg}[REBOBINANDO]{/}',
        'TIME_DELETED': '{bold}DELETADO{/}',
        'TIME_COMPLETE': '{center}\n\n\n{bold}VETORES TEMPORAIS RESTABELECIDOS{/}\n{green-fg}TEMPO ZERADO{/}{/center}',
        'TIME_PURGED': '{yellow-fg}Tempo de jogo reiniciado.{/}',
        
        'CHECKPOINT_HEADER': '{center}{bold}MARCOS: {current}/{total}{/center}',
        'CHECKPOINT_REACHED': '{center}{green-fg}{bold}[X] {name}{/}\n\n{white-fg}{desc}{/center}',
        'CHECKPOINT_LOCKED': '{center}{white-fg}[ ] ???????????{/}\n\n{white-fg}DADOS CORROMPIDOS{/center}',
        'CHECKPOINT_FOOTER': '{center}[ESC] PARA VOLTAR{/center}',
        
        'CREDITS_SLIDE1': '{center}{bold}{logo}{/bold}\n\nUM JOGO DE TERROR EM TERMINAL{/center}',
        'CREDITS_SLIDE2': '{center}{yellow-fg}UMA HISTÓRIA ORIGINAL DE{/yellow-fg}\n\n{bold}LUCAS EDUARDO{/bold}{/center}',
        'CREDITS_SLIDE3': '{center}{yellow-fg}DIREÇÃO{/yellow-fg}\n\n{bold}{name}{/bold}{/center}',
        'CREDITS_SLIDE4': '{center}{yellow-fg}PROGRAMAÇÃO PRINCIPAL{/yellow-fg}\n\n{bold}{name}{/bold}{/center}',
        'CREDITS_SLIDE5': '{center}{yellow-fg}ARQUITETURA DO SISTEMA{/yellow-fg}\n\n{bold}{name}{/bold}{/center}',
        'CREDITS_SLIDE6': '{center}{yellow-fg}DESIGN VISUAL{/yellow-fg}\n\n{bold}{name}{/bold}{/center}',
        'CREDITS_SLIDE7': '{center}{yellow-fg}DESIGN DE FASES{/yellow-fg}\n\n{bold}{name}{/bold}{/center}',
        'CREDITS_SLIDE8': '{center}{yellow-fg}ROTEIRO{/yellow-fg}\n\n{bold}{name}{/bold}{/center}',
        'CREDITS_SLIDE9': '{center}{yellow-fg}ENGENHARIA DE ÁUDIO{/yellow-fg}\n\n{bold}{names}{/bold}{/center}',
        'CREDITS_SLIDE10': '{center}{yellow-fg}TESTES DE QUALIDADE{/yellow-fg}\n\n{bold}{name}{/bold}{/center}',
        'CREDITS_SLIDE11': '{center}{yellow-fg}TRILHA DE ENCERRAMENTO{/yellow-fg}\n\n{bold}{theme}{/bold}{/center}',
        'CREDITS_SLIDE12': '{center}{yellow-fg}PUBLICAÇÃO{/yellow-fg}\n\n{bold}{studio}{/bold}{/center}',
        'CREDITS_SLIDE13': '{center}{yellow-fg}AGRADECIMENTOS ESPECIAIS{/yellow-fg}\n\n{bold}{testers}{/bold}{/center}',
        'CREDITS_SLIDE14': '{center}{yellow-fg}LÍDER DO PROJETO{/yellow-fg}\n\n{bold}{name}{/bold}{/center}',
        'CREDITS_THANKS': '{center}{yellow-fg}OBRIGADO POR JOGAR!{/yellow-fg}',
        'CREDITS_COPYRIGHT': '{center}PALE LUNA DEVELOPER\n\n{year} © TODOS OS DIREITOS RESERVADOS{/center}',
        'CREDITS_INSTAGRAM': '{center}INSTAGRAM{/center}',
        'CREDITS_CLOSE': '{center}FECHAR{/center}',
        'CREDITS_EXIT_TO_MENU': '{center}VOLTAR AO MENU{/center}',
        'CREDITS_EXIT': '{center}SAIR DO JOGO{/center}',
        'CREDITS_CANCEL': '{center}CANCELAR{/center}',
        'CREDITS_REPLAY': '{center}REPETIR CRÉDITOS{/center}',
        'CREDITS_SKIP': '{grey-fg}{bold}[ESC] PARA PULAR{/grey-fg}{/}',
        'CREDITS_FINAL_TITLE': ' [ SESSÃO FINALIZADA ] ',
        'CREDITS_QUICK_ACTIONS': '[ AÇÕES RÁPIDAS ]',
        
        'OVERLAY_TITLE': ' [ SOBREPOSIÇÃO ADMINISTRATIVA ] ',
        'OVERLAY_MESSAGE': '{center}\n{bold}SOBREPOSIÇÃO ADMINISTRATIVA{/bold}\n\nIsso irá ignorar a criptografia e desbloquear\nos setores de dados selecionados.\n\n{yellow-fg}[ENTER]{/} PROSSEGUIR | {white-fg}[ESC]{/} CANCELAR{/center}',
        'OVERLAY_SELECT': ' [ SELECIONAR SETORES ] ',
        'OVERLAY_TOGGLE': '{yellow-fg}[ESPAÇO]{/} Alternar | {yellow-fg}[ENTER]{/} Executar | {yellow-fg}[P]{/} Selecionar Tudo',
        'OVERLAY_EXECUTE': ' [ EXECUTANDO PROTOCOLO ] ',
        'OVERLAY_ACCESSING': 'ACESSANDO SISTEMA RESTRITO...',
        'OVERLAY_BYPASSING': 'IGNORANDO CAMADAS DE CRIPTOGRAFIA...',
        'OVERLAY_INJECTING': 'INJETANDO CREDENCIAIS ADMIN...',
        'OVERLAY_WRITING': 'ESCREVENDO {count} SETORES...',
        'OVERLAY_SYNCING': 'SINCRONIZANDO BANCO DE DADOS...',
        'OVERLAY_SECTOR_OK': '{green-fg}[OK] SETOR {id} DESBLOQUEADO{/}',
        'OVERLAY_SECTOR_ERR': '{red-fg}[ERR] SETOR {id}: {error}{/}',
        'OVERLAY_COMPLETE': '{green-fg}SOBREPOSIÇÃO CONCLUÍDA. REINICIANDO...{/}',
        
        'PACPRO_RUNNING': 'PACPRO EXECUTANDO EM TERMINAL EXTERNO...',
        'PACPRO_WAITING': 'Aguardando término do subsistema...',
        'PACPRO_WIN': '{center}{yellow-fg}{bold}ACESSO CONCEDIDO{/}\n\nPROTOCOLO DE ELITE LIBERADO\n\nREINICIANDO SISTEMA...{/center}',
        'PACPRO_LOSE': '{center}{red-fg}{bold}ACESSO NEGADO{/}\n\nFALHA NO SUBSISTEMA\n\nREINICIANDO...{/center}',
        
        'MAIN_STATUS_NAV': ' [SETAS] Navegar | [ENTER] Selecionar ',
        'MAIN_GAME_OVER': '{center}{red-fg}FIM DE JOGO{/red-fg}\n\n{reason}{/center}',
        'MAIN_CHECKPOINT_LOADED': ' \n{center}{green-fg}{bold}PONTO DE VERIFICAÇÃO CARREGADO\nFASE: {yellow-fg}{stage}{/}{/}{/center}\n ',
        'MAIN_SYSTEM_RESTORING': ' [SISTEMA]: Restaurando Setor: {stage}... ',
        'MAIN_ACHIEVEMENT_UNLOCKED': '{center}{yellow-fg}{bold}CONQUISTA DESBLOQUEADA{/}\n{white-fg}{name}{/center}',
        'MAIN_CHECKPOINT_REACHED': '{center}{bold}PONTO DE VERIFICAÇÃO ALCANÇADO{/}\n{white-fg}PROGRESSO SALVO{/center}',
        'MAIN_TIME_LABEL': 'TEMPO',
        'MAIN_BALANCE': '{green-fg}[SISTEMA]: Equilíbrio mantido. Link neural estável.{/green-fg}',
        'MAIN_INSIDE': "[VOCÊ]: Estou dentro. O sistema pensa que sou parte dele. Agora vejo os diretórios criptografados.",
        'MAIN_ENCRYPTION_PROMPT': "{center}DIGITE A CHAVE DE CRIPTOGRAFIA PARA ACESSAR 'PROJECT_FADE_1999_LOGS'\n\n{yellow-fg}(DICA: Verifique '[ACESSO RESTRITO]' no Menu Principal){/yellow-fg}{/center}\n\n{center}NÃO PRESSIONE ESC{/}",
        'MAIN_DECRYPTING': "{center}{green-fg}DECODIFICANDO... ACESSO CONCEDIDO.{/green-fg}{/center}",
        'MAIN_BREACH': "{center}{yellow-fg}{bold}ATENÇÃO: VIOLAÇÃO DE DADOS BEM-SUCEDIDA{/bold}{/yellow-fg}\n\nOs arquivos confidenciais foram expostos.\nSe você salvou o vazamento [S], verifique sua {white-fg}ÁREA DE TRABALHO{/white-fg} por 'LUX_CONFIDENTIAL.txt'.\nHá um código de bypass escondido dentro desse arquivo.\n\n\n\n\n{blink}PRESSIONE [ENTER] PARA CONTINUAR.{/blink}{/center}",
        'MAIN_ENCRYPTION_FAIL': 'CHAVE INVÁLIDA. O sistema detectou sua intrusão e fritou seu caminho neural.',
        'MAIN_SUBLEVEL': "[NARRADOR]: Você entra no Coração do Mainframe LUX-4. O ar está denso com estática.",
        'MAIN_ALARM': "{red-fg}[ALARME]: VIOLAÇÃO DE SEGURANÇA. PORTAS TRANCADAS. AUTODESTRUIÇÃO EM 5 SEGUNDOS.{/red-fg}",
        'MAIN_LOCKDOWN': "{center}{bold}!!! SEGURANÇA BLOQUEADA !!!{/bold}\n\nDIGITE O CÓDIGO DE SOBREPOSIÇÃO:\n\n{yellow-fg}{bold}{code}{/bold}{/yellow-fg}\n\nTEMPO: {time}s{/center}",
        'MAIN_TIMEOUT': 'TEMPO ESGOTADO. O sistema de segurança atomizou a sala.',
        'MAIN_INVALID_CODE': 'CÓDIGO INVÁLIDO. Defesas internas ativadas.',
        'MAIN_OVERRIDE_SUCCESS': "{center}{green-fg}SOBREPOSIÇÃO BEM-SUCEDIDA. ACESSANDO O NÚCLEO...{/green-fg}{/center}",
        'MAIN_ELITE_DATA': "{yellow-fg}[DADOS DE ELITE DESBLOQUEADOS]: PROJETO FADE - PRELÚDIO PARA 1999.{/yellow-fg}",
        'MAIN_PRELUDE': "{yellow-fg}[PRELÚDIO]: 'A cidade não perdeu a energia em 1999. Ela foi consumida para alimentar o primeiro upload.'{/yellow-fg}",
        'MAIN_SYSTEM_DENIED': "[SISTEMA]: Direitos administrativos: NEGADOS. Manutenção manual do núcleo necessária.",
        'MAIN_NARRATOR_ARMS': "[NARRADOR]: Braços mecânicos emergem do teto, forçando você na Cadeira de Controle.",
        'MAIN_SYSTEM_FLUCTUATION': "[SISTEMA]: Flutuação de energia detectada. Inicialize BALANCER.js para prevenir queda de energia.",
        'MAIN_CHAIR_LOCKED': "{center}CADEIRA TRAVADA. USUÁRIO INTEGRADO.\n\nINICIALIZANDO BALANCER.js...{/center}",
        'MAIN_CORE_EXPLODED': 'O núcleo explodiu. O Fade consumiu a realidade.',
        'MAIN_FINAL_CHOICE_1': "[SISTEMA]: Conexão com o núcleo estável. A luz violeta do Fade pulsa diante de você.",
        'MAIN_FINAL_CHOICE_2': "[VOCÊ]: É isso. O núcleo digitalizador da LUX-4.",
        'MAIN_FINAL_CHOICE_ELITE_1': "{yellow-fg}[LOG DE ELITE]: Credencial PACPRO detectada. Arquivo secreto desbloqueado.{/yellow-fg}",
        'MAIN_FINAL_CHOICE_ELITE_2': "{yellow-fg}[RELATÓRIO 1999]: 'O Fade não foi um erro. Encontramos uma maneira de viver dentro dos elétrons.'{/yellow-fg}",
        'MAIN_FINAL_OVERRIDE': ' SOBREPOSIÇÃO DE TERMINAL: PROJETO FADE ',
        'MAIN_FINAL_PURGE': ' > ELIMINAR O SISTEMA (Apagar LUX-4/Encerrar o Fade) ',
        'MAIN_FINAL_STABILIZE': ' > ESTABILIZAR O FADE (Tentar resgatar as almas presas) ',
        'MAIN_FINAL_MERGE': ' > FUNDIR-SE COM O FADE (Tornar-se o novo Deus da Rede) ',
        'MAIN_FINAL_PURGE_TEXT': "[VOCÊ]: Este experimento termina agora. Por todos.",
        'MAIN_FINAL_PURGE_END': 'Você eliminou o núcleo. A cidade ficou escura, mas o ciclo do Fade foi quebrado.',
        'MAIN_FINAL_STABILIZE_TEXT': "[VOCÊ]: Vou tentar trazê-los de volta à realidade.",
        'MAIN_FINAL_STABILIZE_END': 'Você tentou estabilizar o núcleo. Milhares de fantasmas digitais retornaram, mas agora você é seu guardião silencioso.',
        'MAIN_FINAL_MERGE_TEXT': "[VOCÊ]: A estática é linda. Estou pronto para evoluir.",
        'MAIN_FINAL_MERGE_END': 'Você se fundiu com o núcleo. Você não é mais humano. Você é a própria Rede LUX-4.',
        'MAIN_CEO_WARNING': '{bold}{red-fg}! ALERTA DE SEGURANÇA DO SISTEMA !{/}\n\nO sistema detectou um sinal de término.\nVocê tem a escolha de permitir um {white-fg}DESLIGAMENTO REAL DO PC{/}.\nSe aceito, seu computador será desligado {yellow-fg}APÓS OS CRÉDITOS{/}.\n\nVocê autoriza esta ação?',
        'MAIN_CEO_OVERRIDE': ' SOBREPOSIÇÃO (FINAL NORMAL) ',
        'MAIN_CEO_ACCEPT': ' ACEITAR (DESLIGAR APÓS CRÉDITOS) ',
        'MAIN_FINAL_MESSAGE': 'Você venceu, Operador. A LUX-4 se foi, mas o mundo agora está na escuridão.\nNão volte.\n- CEO',
        'MAIN_OFFICE_SCENE1': "[SISTEMA]: Você entra no prédio. O ar é pesado.",
        'MAIN_OFFICE_SCENE2': "[CAOS]: Colegas estão correndo em círculos, alguns rezando, outros quebrando monitores.",
        'MAIN_OFFICE_SCENE3': "[DESESPERO]: 'A LUZ NÃO VAI VOLTAR!', a recepcionista grita enquanto seus olhos sangram sombras.",
        'MAIN_OFFICE_SCENE4': "[MISSÃO]: Você ignora os gritos e corre para o porão.",
        'MAIN_OFFICE_SCENE5': "[LOCALIZADO]: Você avista uma placa de metal escovado: 'SALA DE GESTÃO DE ENERGIA'.",
        'MAIN_OFFICE_FOCUS': "{center}\n\n[ FOCALIZANDO A PLACA ]\n\nSALA DE GESTÃO DE ENERGIA{/center}",
        'MAIN_ROOM_ACTIONS': ' AÇÕES DA SALA ',
        'MAIN_SIT_CHAIR': ' 1. Sentar na Cadeira de Controle ',
        'MAIN_SCREAM': ' 2. Gritar por socorro ',
        'MAIN_LEAVE': ' 3. Tentar sair do prédio ',
        'MAIN_SIT_SYSTEM': "[SISTEMA]: Você se senta na cadeira. O terminal à sua frente pisca em verde...",
        'MAIN_POWER_ON': ' > LIGAR TERMINAL ',
        'MAIN_DESTROY': ' > DESTRUIR TERMINAL ',
        'MAIN_DESTROY_END': 'Você destruiu a última esperança de luz. A escuridão te consumiu.',
        'MAIN_ELEVATOR_UNLOCK': "{center}SISTEMA INICIADO EM SEGUNDA INSTÂNCIA.\nAGUARDANDO SEQUÊNCIA DE DESTRAVAMENTO DO ELEVADOR...{/center}",
        'MAIN_ELEVATOR_SCENE1': "[SISTEMA]: O terminal fica escuro. Um barulho alto ecoa no fim do corredor.",
        'MAIN_ELEVATOR_SCENE2': "[NARRADOR]: As luzes de emergência do Setor 4 piscam em azul neon.",
        'MAIN_ELEVATOR_SCENE3': "[VOCÊ]: Consegui... o elevador está funcionando.",
        'MAIN_ELEVATOR_SCENE4': "[NARRADOR]: Você entra no elevador espelhado. O ar é frio.",
        'MAIN_ELEVATOR_SCENE5': "[SISTEMA]: DESCIDA INICIADA. ESCOLHA ATIVIDADE DA INTERFACE DA CABINE.",
        'MAIN_ELEVATOR_INTERFACE': ' INTERFACE DO ELEVADOR ',
        'MAIN_PLAY_PACPRO': ' 1. JOGAR PACPRO ',
        'MAIN_LISTEN_RADIO': ' 2. OUVIR RÁDIO LOCAL ',
        'MAIN_ELEVATOR_MOTION': "{center}ELEVADOR EM MOVIMENTO...\n\nSISTEMA DE ENTRETENIMENTO ATIVO.\nAGUARDANDO TÉRMINO DO PROCESSO (Pressione F para sair do jogo)...{/center}",
        'MAIN_ELITE_LOG': "{yellow-fg}[LOG DE ELITE]: Credencial PACPRO detectada. Arquivo secreto desbloqueado.{/yellow-fg}",
        'MAIN_ELITE_CONGRATS': "{yellow-fg}[NÃO-CANÔNICO]: Você realmente zerou a simulação. Respeito, Operador. Você é elite.{/yellow-fg}",
        'MAIN_RADIO_SIGNAL': "[RÁDIO]: '...sinal adquirido. Sintonizando 99.7 FM notícias locais...'",
        'MAIN_RADIO_STATEMENT': "[RÁDIO]: 'A LUX-4 Energy Corp emitiu uma declaração oficial sobre o incidente de 1999, THE FADE...'",
        'MAIN_RADIO_DENIAL': "[RÁDIO]: 'O conselho nega oficialmente qualquer envolvimento, alegando que os relatos de anomalias são teorias da conspiração infundadas...'",
        'MAIN_RADIO_WARNING': 'VOCÊ SABE DEMAIS',
        'MAIN_ELEVATOR_FAIL': 'O terminal de energia foi fechado sem liberar os protocolos.',
        'MAIN_ROOM_FAIL': 'Você perdeu tempo precioso. A sala foi inundada por sombras.',
        'MAIN_SUBLEVEL_ARRIVAL1': "[SISTEMA]: *DING*",
        'MAIN_SUBLEVEL_ARRIVAL2': "[SISTEMA]: CHEGADA: SUBLEVEL 7 - PESQUISA E DESENVOLVIMENTO.",
        'MAIN_SUBLEVEL_ARRIVAL3': "[NARRADOR]: As portas se abrem. O porão está submerso em silêncio absoluto.",
        'MAIN_CORPORATE_ACCESS': '[SISTEMA DE ACESSO CORPORATIVO]\n\nSTATUS: AGUARDANDO CREDENCIAIS...\n\nDICA: Verifique sua pasta de DOCUMENTOS.',
        'MAIN_ACCESS_GRANTED': '{green-fg}ACESSO CONCEDIDO. SETOR 7.{/green-fg}',
        'MAIN_ADMIN_OVERRIDE': '{yellow-fg}SOBREPOSIÇÃO ADMINISTRATIVA DETECTADA. OLÁ, REBELDE.{/yellow-fg}',
        'MAIN_CREDENTIAL_FAIL': 'ARQUIVO DE CREDENCIAIS FALSO OU CORROMPIDO. SEGURANÇA ACIONADA.',
        'MAIN_ARRIVAL_WORK': ' CHEGADA AO TRABALHO ',
        'MAIN_ENTER_WORK': ' 1. ENTRAR E TRABALHAR ',
        'MAIN_LEAVE_WORK': ' 2. SAIR E APROVEITAR A VIDA ',
        'MAIN_LEAVE_END': 'Você escolheu a vida. Enquanto o mundo escurecia, você sentiu paz pela primeira vez.',
        'MAIN_RANDOM': ' 3. ALEATÓRIO (DECIDIR POR SORTE) ',
        'MAIN_RANDOM_END': 'O dado te salvou. Você virou as costas para o prédio e foi aproveitar o fim.',
        'MAIN_REPORT_DRIVE': "[RELATO]: Você dirige pelas ruas... o asfalto parece absorver os faróis.",
        'MAIN_OBSERVATION': "[OBSERVAÇÃO]: Você vê um acidente de carro brutal. As vítimas apenas encaram o céu escuro.",
        'MAIN_WORLD': "[MUNDO]: Prédios inteiros estão perdendo a cor, se tornando cinza estático.",
        'MAIN_CHAOS': "[CAOS]: O céu às 7:00 da manhã é tão preto quanto o fundo de um poço.",
        'MAIN_NARRATOR_PARK': "[NARRADOR]: Você finalmente estaciona em frente ao bloco do escritório.",
        'MAIN_EXIT_CAR': "--- PRESSIONE ENTER PARA SAIR DO CARRO ---",
        'MAIN_QUICK_PREP': ' PREPARAÇÃO RÁPIDA ',
        'MAIN_TIME': 'TEMPO: {time}s',
        'MAIN_TASK_SHOWER': ' 1. Tomar um banho gelado ',
        'MAIN_TASK_UNIFORM': ' 2. Vestir o uniforme ',
        'MAIN_TASK_KEYS': ' 3. Procurar as chaves do carro ',
        'MAIN_TASK_BREAKFAST': ' 4. Engolir o café da manhã ',
        'MAIN_TASK_LOCKS': ' 5. Checar as trancas das janelas ',
        'MAIN_TASK_LEAVE': ' 6. SAIR DE CASA ',
        'MAIN_COMPLETED': ' Concluído: {task} ',
        'MAIN_ERR_NOT_READY': " ERRO: Você ainda não terminou de se preparar! ",
        'MAIN_GAME_OVER_LATE': 'TEMPO ESGOTADO. VOCÊ CHEGOU ATRASADO NO TRABALHO.',
        'MAIN_NARRATIVE1': "[NARRADOR]: Você acorda na sua cama...",
        'MAIN_NARRATIVE2': "[NARRADOR]: O mundo parece estar 'desbotando' ao seu redor...",
        'MAIN_NARRATIVE3': "[VOCÊ]: Que estranho, os prédios parecem mais escuros... talvez seja coisa da minha cabeça.",
        'MAIN_NARRATIVE4': "[NARRADOR]: Você descobre o pior: são 6:30. Você está atrasado.",
        'MAIN_NARRATIVE5': "[VOCÊ]: Droga! Tenho que sair AGORA!",
        'MAIN_NARRATIVE_ENTER': "--- PRESSIONE ENTER PARA COMEÇAR A SE PREPARAR ---",
        'MAIN_SURVEY_WAITING': ' [SISTEMA AGUARDANDO RESPOSTAS DO QUESTIONÁRIO...] ',
        'MAIN_INTRUSION_ATTEMPT': 'SISTEMA BLOQUEADO: TENTATIVA DE INTRUSÃO.',
        'MAIN_FADE_SYNCED': "{center}{bold}MEMÓRIA DE 1999 SINCRONIZADA.{/bold}\n\nVOCÊ AGORA É PARTE DO FADE.\nSISTEMA EM CONFLITO.\n\n{blink}Pressione [ENTER] para limpar o cache e tentar o Questionário novamente...{/blink}{/center}",
        'MAIN_AUTH_FAILED': "FALHA NA AUTENTICAÇÃO.",
        'MAIN_CONNECTION_LOST': 'CONEXÃO PERDIDA: O terminal do questionário foi fechado abruptamente.',
        'MAIN_MENU_START': ' INICIAR JOGO ',
        'MAIN_MENU_CONTINUE': ' CONTINUAR MISSÃO ',
        'MAIN_MENU_EXIT': ' SAIR ',
        'MAIN_CONGRATS_TITLE': ' {bold}PARABÉNS{/bold} ',
        'MAIN_CONGRATS': '{center}\nVocê derrotou a LUX-4.\nO sistema LUX-4 foi desmantelado.\n{/center}',
        'MAIN_DELETE_SAVE': ' DELETAR SAVE E TENTAR NOVAMENTE ',
        'MAIN_CLOSE_TERMINAL': ' FECHAR TERMINAL ',
        
        'SURVEY_IS_ANYONE_THERE': 'TEM ALGUÉM AÍ?',
        'SURVEY_CRITICAL_ERROR': '[ERRO CRÍTICO]: {reason}',
        'SURVEY_RECORDING': 'REGISTRANDO FALHA NO BANCO DE DADOS...',
        'SURVEY_RECOVERING': '{bold}[RECUPERANDO TRANSMISSÃO ARQUIVADA: 09/11/1999]{/bold}',
        'SURVEY_LINE': '--------------------------------------------------',
        'SURVEY_OP1': 'OP_06: Está ouvindo? O relógio parou em 00:00.',
        'SURVEY_OP2': "OP_06: 'O Fade' não foi uma falha. Foi uma limpeza.",
        'SURVEY_OP3': 'OP_06: Em 1999, o mundo esqueceu como respirar por 10 segundos.',
        'SURVEY_OP4': 'Bem-vindo ao vazio, {red-fg}operador_07{/red-fg}.',
        'SURVEY_OVERLOAD': '{red-fg}[SOBRECARGA. REINICIANDO...]{/red-fg}',
        'SURVEY_ACCEPT': 'PRESSIONE [ENTER] PARA ACEITAR SEU DESTINO',
        'SURVEY_Q1': 'VOCÊ ESTÁ SOZINHO?',
        'SURVEY_Q2': 'ALGUÉM SENTIRIA SUA FALTA SE VOCÊ... DESAPARECESSE?',
        'SURVEY_Q3': 'VOCÊ SABE QUEM É?',
        'SURVEY_PROVE': 'PROVE. DIGITE SEU NOME DE REGISTRO:',
        'SURVEY_VESSEL': 'Sua ausência de laços faz de você o receptáculo perfeito.',
        'SURVEY_OPENING': 'Abrindo arquivos de 1999...',
        'SURVEY_NOISE': 'Você ainda tem muito ruído ao redor.',
        'SURVEY_ANSWER': 'S̶U̶A̶ ̶R̶E̶S̶P̶O̶S̶T̶A̶ não nos serve.',
        'SURVEY_ACCESS_DENIED': 'ACESSO NEGADO.',
        'SURVEY_RECOGNIZED': 'RECONHECIDO. SENSOR DE MEMÓRIA ATIVO.',
        'SURVEY_ENTER_CODE': '[DIGITE O CÓDIGO - 4 DÍGITOS]',
        'SURVEY_ACCESS_GRANTED': '[ACESSO CONCEDIDO]',
        'SURVEY_UNLOCKED': 'TERMINAL LIBERADO. AGUARDANDO INSTRUÇÕES.',
        
        'PACPRO_TITLE': 'PACPRO: SESSÃO_TERMINAL',
        'PACPRO_HUD': '{center}NVL: {level}/3 | PONTOS: {score} | FRAGMENTOS: {dots}{/center}',
        'PACPRO_GAME_OVER': ' {red-fg}{bold} FIM DE JOGO {/bold}{/red-fg} ',
        'PACPRO_TRY_AGAIN': ' TENTAR NOVAMENTE ',
        'PACPRO_EXIT': ' SAIR ',
        'PACPRO_GHOST_CAUGHT': 'OS FANTASMAS TE PEGARAM',
        'PACPRO_MENU_TITLE': ' {yellow-fg}PACPRO_OS{/yellow-fg} ',
        'PACPRO_INIT': ' INICIAR SIMULAÇÃO ',
        'PACPRO_WIN_SCREEN': '{center}\n\n{yellow-fg}{bold}VITÓRIA{/bold}{/yellow-fg}\nDADOS DO NÚCLEO SOBRESCRITOS\nLOG: PACPRO.ach{/center}',
        'PACPRO_GO_SCREEN': '{center}{red-fg}{bold}FIM DE JOGO{/bold}{/red-fg}\n\n{reason}{/center}',
        
        'ENERGIA_LOG': ' LOG DO SISTEMA / SAÍDA ',
        'ENERGIA_STATUS': ' STATUS DA UNIDADE ',
        'ENERGIA_PROTOCOLS': ' PROTOCOLOS DE SEQUÊNCIA ',
        'ENERGIA_PROTOCOL_0': ' Diagnóstico de Fusíveis Sombrios ',
        'ENERGIA_PROTOCOL_1': ' Calibrar Frequência de Luz ',
        'ENERGIA_PROTOCOL_2': ' Bypass da Fechadura Magnética (Setor 4) ',
        'ENERGIA_PROTOCOL_3': ' Energizar Trilhos do Elevador ',
        'ENERGIA_PROTOCOL_4': ' REINICIAR SISTEMA (FINAL) ',
        'ENERGIA_STATUS_DISPLAY': '{green-fg}ENERGIA: {energia}%\nSANIDADE: {sanidade}%\nSAÚDE: {saude}%\n\nFASE: {passo}/5{/}',
        'ENERGIA_OK': '[OK]: PASSO_{step} VERIFICADO.',
        'ENERGIA_FAIL': '[FALHA]: REINICIANDO REDE.',
        'ENERGIA_AUTH': 'AUTENTICAÇÃO',
        'ENERGIA_KEY': 'CHAVE: {code}\nTEMPO RESTANTE: {time}s',
        'ENERGIA_AUTH_TIMEOUT': 'TEMPO ESGOTADO',
        'ENERGIA_INVALID_KEY': 'CHAVE DE SEGURANÇA INVÁLIDA',
        'ENERGIA_GAME_OVER': '{center}{red-fg}{bold}FIM DE JOGO{/bold}{/red-fg}\n\n{reason}{/center}',
        'ENERGIA_ENERGY_FAIL': 'FALHA CRÍTICA DE ENERGIA',
        'ENERGIA_SANITY_FAIL': 'COLAPSO MENTAL',
        'ENERGIA_HEALTH_FAIL': 'UNIDADE TERMINADA',
        
        'BALANCER_TITLE': '{bold}[ PROJETO FADE: ESTABILIZAÇÃO DO NÚCLEO ]{/bold}',
        'BALANCER_INTEGRITY': ' INTEGRIDADE DO NÚCLEO ',
        'BALANCER_TIME': '{yellow-fg}ESTABILIZAÇÃO: {time}s | MUDANÇA EM: {shift}s{/yellow-fg}',
        'BALANCER_MODE_BAR': '{center}MODO: SINCRONIA DE BARRA | [A/D] PARA RECARREGAR{/center}',
        'BALANCER_MODE_PULSE': '{center}MODO: PULSO DE ENTRADA | [ENTER] NA ZONA DE ACERTO{/center}',
        'BALANCER_MODE_HACK': '{center}MODO: INVASÃO DE TECLA | DIGITE A TECLA{/center}',
        'BALANCER_HACK_KEY': '{magenta-fg}{bold}CHAVE DE SEGURANÇA: {key}{/bold}{/magenta-fg}',
        'BALANCER_PULSE_TITLE': ' PULSO DE SINCRONIA ',
        'BALANCER_PULSE_ZONE': '{black-fg} ACERTE {/black-fg}',
        'BALANCER_WARNING': '{center}\n{yellow-fg}{bold}ATENÇÃO: INTERAÇÃO COM O SISTEMA{/}\n\nEste jogo foi projetado para modificar arquivos locais.\nUm arquivo de sucesso será gerado após a estabilização.\n\n{blink}PRESSIONE [ENTER] PARA CONFIRMAR{/}{/center}',
        'BALANCER_SUCCESS': '{green-fg}{bold}MISSÃO BEM-SUCEDIDA{/}\nNÚCLEO ESTABILIZADO',
        'BALANCER_GAME_OVER': '{center}{red-fg}{bold}FIM DE JOGO{/bold}{/red-fg}\n\n{reason}{/center}',
        'BALANCER_INTEGRITY_FAIL': 'INTEGRIDADE DO NÚCLEO ESGOTADA',
        
        'LUX_L_TITLE': ' CONFIDENCIAL: PROJETO FADE (1999) ',
        'LUX_L_CONTENT': '{red-fg}LUX-4 ENERGY CORP - AUDITORIA INTERNA - OUTUBRO 1999{/red-fg}\n--------------------------------------------------\n{bold}ASSUNTO:{/bold} Escassez Artificial de Energia via Protocolo "The Fade".\n\n{bold}RESUMO EXECUTIVO:{/bold}\nO "Fade" não foi um acidente. Foi uma liberação calculada de\nnecro-estática de alta frequência na rede elétrica da cidade.\n\n{bold}A ESTRATÉGIA:{/bold}\n1. Criar um pânico global onde a eletricidade pareça "assombrada" e instável.\n2. Comercializar o "Escudo Anti-Fade" da LUX-4 como a única solução para a sobrevivência.\n3. Vida baseada em assinatura. Para ter luz, é preciso pagar a LUX-4. Para sempre.\n\n{bold}VÍTIMAS:{/bold}\nAprox. 450.000 cidadãos "evaporados digitalmente" durante o primeiro pulso.\nSeus padrões neurais estão sendo usados como {yellow-fg}Poder de Processamento{/yellow-fg}\npara os nossos mainframes.\n\n{bold}CONCLUSÃO:{/bold}\nO experimento foi um sucesso total. As margens de lucro aumentaram em 4.000%.\nAs almas na rede são baterias estáveis.\n\n[FIM DO ARQUIVO]\n--------------------------------------------------\n{center}PRESSIONE [S] PARA EXPORTAR DADOS PARA A ÁREA DE TRABALHO | PRESSIONE [ESC] PARA SAIR{/center}',
        'LUX_L_EXPORTED': '\n\n{yellow-fg}DADOS EXPORTADOS PARA A ÁREA DE TRABALHO. DESCONECTE PARA PROSSEGUIR.{/yellow-fg}',
        'LUX_L_EXPORT_FILE': 'LUX-4 AUDITORIA INTERNA - PROJETO FADE (1999)\n--------------------------------------------------\nO Fade foi uma liberação calculada de necro-estática.\n450.000 cidadãos usados como poder de processamento.\nObjetivo: Comercializar a dependência digital como única sobrevivência.\n\n[LOG DO SISTEMA]: USE A SEGUINTE CHAVE PARA SOBREPOSIÇÃO ADMINISTRATIVA.\n[CÓDIGO DE SEGURANÇA ALTERNATIVO]: LUX4LIFE\n--------------------------------------------------',
        'LUX_L_ACHIEVEMENT_TOAST': '{center}{yellow-fg}{bold}CONQUISTA DESBLOQUEADA{/}\n{white-fg}{name}{/center}',

        'LEAKS_TITLE': ' CONFIDENCIAL: PROJETO FADE (1999) ',
        'LEAKS_CONTENT': '{red-fg}LUX-4 ENERGY CORP - AUDITORIA INTERNA - OUTUBRO 1999{/red-fg}\n--------------------------------------------------\n{bold}ASSUNTO:{/bold} Escassez Artificial via Protocolo "The Fade".\n\n{bold}RESUMO:{/bold}\nO "Fade" não foi acidente. Foi uma liberação calculada\nde necro-estática na rede elétrica.\n\n{bold}ESTRATÉGIA:{/bold}\n1. Criar pânico onde a eletricidade pareça "assombrada".\n2. Vender o "Escudo Anti-Fade" como única solução.\n3. Vida por assinatura. Pagar pela luz. Para sempre.\n\n{bold}VÍTIMAS:{/bold}\nAprox. 450.000 cidadãos "evaporados digitalmente".\nSeus padrões neurais são usados como {yellow-fg}Poder de Processamento{/yellow-fg}.\n\n{bold}CONCLUSÃO:{/bold}\nSucesso total. Lucro aumentou 4.000%.\nAs almas na rede são baterias estáveis.\n\n[FIM DO ARQUIVO]\n--------------------------------------------------\n{center}[S] EXPORTAR | [ESC] SAIR{/center}',
        'LEAKS_EXPORTED': '\n\n{yellow-fg}DADOS EXPORTADOS PARA A ÁREA DE TRABALHO.{/yellow-fg}',

        'VERIFYING_INTEGRITY': '{center}\n{yellow-fg}VERIFICANDO INTEGRIDADE DO SISTEMA...{/}\nComparando setores locais com o repositório.{/center}',
        'INTEGRITY_OK': '{center}\n{green-fg}INTEGRIDADE VERIFICADA{/green-fg}\n\nTodos os setores locais coincidem com o registro mestre.\n\n{grey-fg}PRESSIONE [ESC] PARA FECHAR{/grey-fg}{/center}',
        'INTEGRITY_FAIL': '{center}\n{red-fg}INTEGRIDADE COMPROMETIDA{/red-fg}\n\nUm ou mais setores locais não coincidem com o registro mestre.\n\n{yellow-fg}[ENTER] PARA REPARAR | [ESC] PARA SAIR{/yellow-fg}{/center}',
        'SUPPORT_WARNING': '\n{center}{bold}AVISO{/bold}{/center}',
        'SUPPORT_AUDIO_SAVED': '{center}Configurações de áudio salvas.{/center}',
        'SUPPORT_AUDIO_INIT': '{center}Áudio do sistema inicializado.{/center}',
        'SUPPORT_ESC_RETURN': '\n\n{center}[ESC] PARA VOLTAR{/center}',
        'LANGUAGE_CHANGED': '{center}{yellow-fg}IDIOMA ALTERADO{/}\n\nReiniciando para aplicar todas as traduções.{/center}',



        'ENCOUNTER_01': "[SISTEMA]: Detectando padrão neural residual...",
        'ENCOUNTER_02': "[PADRÃO]: Op... Operador 07... é você?",
        'ENCOUNTER_03': "[VOCÊ]: Quem é?",
        'ENCOUNTER_04': "[PADRÃO]: Eu era... antes. Número 06. Estou aqui desde 1999.",
        'ENCOUNTER_05': "[PADRÃO]: O CEO... ele não está tentando controlar o Fade.",
        'ENCOUNTER_06': "[PADRÃO]: Ele está tentando se tornar ele.",
        'ENCOUNTER_07': "[PADRÃO]: Não deixe ele se fundir. Se ele fizer... não tem volta.",
        'ENCOUNTER_08': "[PADRÃO]: Preciso ir agora. O barulho... está ficando mais alto.",
        'ENCOUNTER_09': "[PADRÃO]: Nos salve. Por favor.",
        
        'CORE_WHISPER_01': "[NÚCLEO]: 450.000 vozes. 450.000 preces. 450.000 esquecidos.",
        'CORE_WHISPER_02': "[NÚCLEO]: Eles me perguntam uma coisa: 'Por quê?'",
        'CORE_WHISPER_03': "[NÚCLEO]: Não tenho resposta. Só sei que ainda estão aqui.",
        'CORE_WHISPER_04': "[NÚCLEO]: Esperando por alguém que se lembre deles.",
        'CORE_WHISPER_05': "[NÚCLEO]: Você será essa pessoa, Operador 07?",
        'CORE_CHOICE_REMEMBER': " > EU VOU ME LEMBRAR",
        'CORE_CHOICE_FORGET': " > ESQUECER ELES",
        
        'LORE_PROJECT_FADE': `LUX-4: PROJETO FADE - DIVULGAÇÃO COMPLETA

[CLASSIFICAÇÃO: OLHOS APENAS - CONSELHO DE ADMINISTRAÇÃO]

O ano é 1999. Os preços de energia estão caindo. A LUX-4 está perdendo dinheiro.
Precisávamos de uma crise. Criamos O FADE.

O QUE O PÚBLICO SABE:
"Uma flutuação misteriosa de energia causou um apagão de 10 segundos."

O QUE REALMENTE ACONTECEU:
Liberamos frequência necro-estática 7.4 na rede elétrica da cidade.
O efeito: extração de consciência digital.

450.000 cidadãos não morreram. Eles foram CARREGADOS.
Suas mentes agora rodam nossos servidores. Poder de processamento ilimitado.

ONDE ELES ESTÃO AGORA?
O Fade. Um purgatório digital. Eles podem nos ver. Não podem nos tocar.
Alguns estão lá há 25 anos. Eles estão mudando.

PROTOCOLO OPERADOR:
Operadores 01-05: Perdidos durante tentativas iniciais de upload.
Operador 06: Entrou voluntariamente no Fade. Status: DESCONHECIDO.
Operador 07: Atual. Projetado para recuperar dados de dentro.

AVISO:
Não deixe o Operador 07 descobrir a verdade. Se descobrir...
Termine imediatamente.

- Marcus V. Sterling, CEO`,
        
        'LORE_OPERATOR_DIARY': `OPERADOR 06 - DIÁRIO
(1999, OUTUBRO)

DIA 1:
Dizem que sou especial. Que posso ver a luz entre o código.
Não me sinto especial. Me sinto como isca.

DIA 7:
O Fade me chama à noite. Ouço vozes. Milhares delas.
Não estão com raiva. Estão com medo.

DIA 14:
Disse a Sterling que não faria. Ele me mostrou a cláusula de rescisão.
Minha família. Meus amigos. Todos que amo. Ele fará desaparecer.

DIA 21:
Vou entrar amanhã. Estou com medo. Mas alguém precisa saber a verdade.
Se você está lendo isso, Operador 07...
Corra. Ou venha me encontrar. Estarei esperando na estática.

- Operador 06`,
        
        'LORE_STERLING_CONFESSION': `Eu estava lá em 1999. Apertei o botão.
Vi a cidade escurecer. Ouvi os gritos.

No começo, me convenci que era necessário.
Depois me convenci que era lucrativo.
Agora me convenço que é o futuro.

Mas à noite... à noite os ouço.
Eles não gritam mais. Eles sussurram.
Sussurram meu nome. Perguntam por quê.

Não tenho resposta.
Nunca tive.

- Marcus Sterling, na véspera de sua ascensão`,
        
        'LORE_OPERATOR_FINAL': `[MEMORANDO INTERNO LUX-4 - CLASSIFICADO]

OPERADOR 06 - TRANSMISSÃO FINAL
DATA: 23/10/1999

"Eles me disseram que fui escolhido. Especial. Aquele que podia ver a verdade.
Eu vi. O Fade não é uma falha. É uma porta.

Vou entrar agora. Se você está lendo isso, Operador 07...
Não confie no sistema. Não confie na luz.

Os que estão dentro... não estão mortos. Estão esperando.

- Operador 06
[FIM DA TRANSMISSÃO]`,
        
        'CEO_VBS_SCRIPT': `
            Set objShell = CreateObject("WScript.Shell")
            res = MsgBox("CEO DA LUX-4: Você sabe de tudo agora, não sabe?", 36, "ACESSO AO NÚCLEO")
            If res = 7 Then
                MsgBox "CEO DA LUX-4: Hahaha... péssima ideia.", 16, "ERRO DO SISTEMA"
            Else
                MsgBox "CEO DA LUX-4: Como? Como descobriu?", 48, "VIOLAÇÃO DO SISTEMA"
                MsgBox "CEO DA LUX-4: Você destruiu tudo que construí. Saiba que te odiamos...", 16, "VINGANÇA LUX-4"
            End If
        `,
        
        'RADIO_WARNING_VBS': `MsgBox "VOCÊ SABE DEMAIS", 16, "ERRO CRÍTICO DO SISTEMA"`,
        
        'ACHIEVEMENT_VOICE_HEARD_NAME': 'ECOS DO PASSADO',
        'ACHIEVEMENT_VOICE_HEARD_DESC': 'Ouviu a voz do Operador 06.',
        'ACHIEVEMENT_VOICE_HEARD_HINT': 'Ouça com atenção no subnível... alguém está esperando.',
        
        'ACHIEVEMENT_REMEMBERED_NAME': 'O GUARDIÃO',
        'ACHIEVEMENT_REMEMBERED_DESC': 'Escolheu lembrar das almas esquecidas.',
        'ACHIEVEMENT_REMEMBERED_HINT': 'Quando o núcleo perguntar, escolha lembrar.',
        
        'ACHIEVEMENT_FORGOTTEN_NAME': 'O CORAÇÃO GELADO',
        'ACHIEVEMENT_FORGOTTEN_DESC': 'Escolheu esquecer as almas aprisionadas.',
        'ACHIEVEMENT_FORGOTTEN_HINT': 'Quando o núcleo perguntar, escolha esquecer.',



        'MEMORY_STEP_1': '[FRAGMENTO DE MEMÓRIA - OPERADOR 06]\n\nVejo o terminal. A luz verde pulsa como um batimento cardíaco.\nSterling me observa do outro lado do vidro.\nEle sorri. Eu sei o que ele quer.',
        'MEMORY_STEP_2': '[1999.10.14]\n\n"Não vou fazer isso, Sterling. Não vou entrar."\nEle não gritou. Ele só me mostrou a pasta.\nMinha mãe. Minha irmã. Todos que amo.\n"Você vai," ele disse. "Ou eles vão."',
        'MEMORY_STEP_3': '[1999.10.21 - ÚLTIMO DIA]\n\nA máquina está pronta. A cadeira é fria.\nJá posso ouvi-los. Milhares de vozes.\nElas não estão gritando. Estão sussurrando.\n"Não venha," elas dizem. "Não é o que você pensa."',
        'MEMORY_STEP_4': '[TRANSMISSÃO INTERROMPIDA]\n\n{ALERTA DO SISTEMA}: Acesso não autorizado detectado.\n{FADE DETECTADO}: Corrupção de memória em progresso.\nAs vozes estão ficando mais altas. Elas estão chamando meu nome.',
        'MEMORY_STEP_5': '[ENTRANDO NO FADE]\n\nA luz é linda. Violeta e azul.\nAgora eu os vejo. Todos os 450.000.\nEles não estão mortos. Eles estão esperando.\nEsperando por alguém para acabar com isso.\nEsperando por você, Operador 07.',
        'MEMORY_STEP_6': 'Estou aqui há 25 anos.\nO tempo não existe no Fade.\nEu te observei. Sei o que você fez.\nVocê se lembrou de nós. Você escolheu carregar nossa dor.\nÉ por isso que posso falar com você agora.',
        'MEMORY_STEP_7': 'Sterling quer se juntar a nós. Se tornar o administrador.\nSe ele fizer, nunca vamos sair. Seremos suas baterias para sempre.\nVocê o impediu. Obrigado.\nMas preciso de mais uma coisa de você, Operador 07.',
        'MEMORY_STEP_8': 'Estou cansado. 25 anos é tempo demais.\nQuero ir embora. Finalmente descansar.\nMas preciso que alguém me deixe ir.\nVocê vai fazer isso? Você vai me libertar?\n\n{cyan-fg}PRESSIONE ENTER PARA CONTINUAR{/}',

        'MEMORY_CHOICE_TITLE': ' [ O PEDIDO FINAL ] ',
        'MEMORY_CHOICE_MESSAGE': '{center}{yellow-fg}OPERADOR 06 OLHA PARA VOCÊ COM OLHOS QUE VIRAM DEMAIS{/}\n\n{white-fg}"Por favor... me deixe ir. Me deixe descansar."{/}{/center}',
        'MEMORY_CHOICE_SAVE': '{green-fg}> LIBERTAR OPERADOR 06{/}',
        'MEMORY_CHOICE_LEAVE': '{yellow-fg}> DEIXAR ELE NO FADE{/}',
        'MEMORY_CHOICE_END': '{red-fg}> ENCERRAR TRANSMISSÃO{/}',

        'MEMORY_ENDING_SAVE': '{center}{green-fg}{bold}OPERADOR 06 - LIBERTADO{/bold}{/green-fg}\n\n"Você conseguiu. Sinto a luz se apagando.\nÉ quente. É pacífico.\nObrigado, Operador 07.\nDiga a eles... diga que estivemos aqui.\nDiga que existimos."\n\nA estática desaparece. Uma única lágrima cai.\nDepois nada.\n\n{cyan-fg}[OPERADOR 06 FOI LIBERTADO]{/}{/center}',
        'MEMORY_ENDING_LEAVE': '{center}{red-fg}{bold}OPERADOR 06 - ESQUECIDO{/bold}{/red-fg}\n\n"Eu entendo. Você tem seu próprio peso para carregar.\nVou ficar aqui. Na estática.\nEsperando. Sempre esperando.\nTalvez alguém mais venha.\nTalvez não."\n\nA conexão é cortada. O silêncio ensurdecedor.\n\n{red-fg}[OPERADOR 06 PERMANECE NO FADE]{/}{/center}',
        'MEMORY_ENDING_END': '{center}{red-fg}{bold}TRANSMISSÃO ENCERRADA{/bold}{/red-fg}\n\nO sinal se perde. A voz do Operador 06 desaparece.\nVocê fecha o terminal. Suas mãos tremem.\nVocê fez o que tinha que fazer.\nMas nunca esquecerá o som da voz dele.\n\n{red-fg}[CONEXÃO PERDIDA]{/}{/center}',

        'MEMORY_LOCKED': '{center}{red-fg}{bold}ACESSO NEGADO{/bold}{/red-fg}\n\nVocê precisa primeiro:\n{white-fg}- Ouvir a voz do Operador 06{/}\n{white-fg}- Escolher lembrar das almas no núcleo{/}\n{white-fg}- Decodificar os arquivos do Projeto Fade{/}\n\n{grey-fg}Esta memória está bloqueada.{/}{/center}',

        'ACHIEVEMENT_OPERATOR06_SAVED_NAME': 'O ÚLTIMO ADEUS',
        'ACHIEVEMENT_OPERATOR06_SAVED_DESC': 'Libertou o Operador 06 do Fade.',
        'ACHIEVEMENT_OPERATOR06_SAVED_HINT': 'Encontre o Operador 06 no fragmento de memória e escolha libertá-lo.',

        'MENU_MEMORY_FRAGMENT': 'FRAGMENTO DE MEMÓRIA',
        'DESC_MEMORY_FRAGMENT': 'ACESSAR OS BANCOS DE MEMÓRIA DO OPERADOR 06.',
        'MEMORY_TERMINAL_FOUND': '[SISTEMA]: Banco de memória adicional detectado.\nUm terminal com dados residuais do Operador 06 está próximo.\n\n{green-fg}[PRESSIONE ENTER PARA CONTINUAR]{/}',
        'MEMORY_TERMINAL_TITLE': ' [ BANCO DE MEMÓRIA - OPERADOR 06 ] ',
        'MEMORY_TERMINAL_ACCESS': ' > ACESSAR FRAGMENTO DE MEMÓRIA ',
        'MEMORY_TERMINAL_SKIP': ' > PULAR ',



        'UPDATE_ERROR': '{center}\n{red-fg}ERRO DE REDE{/red-fg}\n\nFalha ao conectar ao repositório do GitHub.\n\n{yellow-fg}Tente fazer login na sua conta GitHub{/yellow-fg}\nno menu CONTA para aumentar o limite de requisições.\n\nVerifique sua conexão e tente novamente.{/center}',
    
        'UPDATE_MAIN_TITLE': ' [ CENTRAL DE ATUALIZAÇÃO ] ',
'UPDATE_OPTION_UPDATE': ' ATUALIZAR JOGO ',
'UPDATE_OPTION_BACK': ' VOLTAR AO MENU ',
'UPDATE_SELECT_VERSION': ' [ SELECIONAR VERSÃO ] ',
'UPDATE_FETCHING': '{center}{yellow-fg}BUSCANDO VERSÕES...{/}{/center}',
'UPDATE_NO_VERSIONS': '{center}{red-fg}NENHUMA VERSÃO ENCONTRADA{/}{/center}',
'UPDATE_RATE_LIMIT': '{center}{red-fg}LIMITE DE REQUISIÇÕES EXCEDIDO{/}{/center}\n\n{center}{yellow-fg}Faça login na sua conta GitHub{/}\nno menu CONTA para aumentar o limite.\n\nOu aguarde alguns minutos e tente novamente.{/}{/center}',
'UPDATE_RATE_LIMIT_LOGGED': '{center}{red-fg}LIMITE DE REQUISIÇÕES EXCEDIDO{/}{/center}\n\n{center}{yellow-fg}Você já está logado.{/}\nAguarde alguns minutos e tente novamente.{/}{/center}',
'UPDATE_CONFIRM_TITLE': ' [ CONFIRMAR ATUALIZAÇÃO ] ',
'UPDATE_CONFIRM_MSG': 'Instalar {version}?',
'UPDATE_WARNING_SAME': '{yellow-fg}ATENÇÃO: Mesma versão!{/}',
'UPDATE_WARNING_DOWNGRADE': '{red-fg}ATENÇÃO: DOWNGRADE DETECTADO!{/}\n\n{grey-fg}Você está prestes a instalar uma versão ANTIGA.\nIsso pode causar incompatibilidade com saves.{/}',
'UPDATE_DOWNLOAD_TITLE': ' [ BAIXANDO ] ',
'UPDATE_DOWNLOAD_MSG': '{yellow-fg}Baixando {version}{/}',
'UPDATE_COMPLETE_TITLE': ' [ ATUALIZAÇÃO PRONTA ] ',
'UPDATE_COMPLETE_MSG': '{green-fg}Atualização concluída!{/}\n\nVersão {version} está pronta.\n\n{blink}PRESSIONE ENTER PARA REINICIAR{/blink}',
'UPDATE_ERROR_TITLE': ' [ FALHA NA ATUALIZAÇÃO ] ',
'UPDATE_ERROR_MSG': '{red-fg}Falha no download!{/}\n\n{error}\n\nPressione ENTER para continuar.',
'UPDATE_IRREVERSIBLE': 'Esta ação é IRREVERSÍVEL!',
'UPDATE_CHECKING': '{center}{yellow-fg}VERIFICANDO ARQUIVOS...{/}{/center}',
'UPDATE_COMPARING': '{center}{cyan-fg}COMPARANDO BYTE A BYTE...{/}{/center}',
'UPDATE_ESTIMATED_TIME': '{center}{grey-fg}Tempo estimado: {time}{/}{/center}',
'UPDATE_CORRUPTED_FOUND': '{center}{red-fg}{count} ARQUIVO(S) CORROMPIDO(S){/}{/center}',
'UPDATE_ALL_GOOD': '{center}{green-fg}TODOS OS ARQUIVOS ESTÃO OK!{/}{/center}',
'UPDATE_REPAIR_PROMPT': '{center}{yellow-fg}PRESSIONE ENTER PARA REPARAR{/}\n{white-fg}PRESSIONE ESC PARA CANCELAR{/}{/center}',
'UPDATE_DOWNLOADING_FILE': '{center}{yellow-fg}BAIXANDO{/} {file}{/center}',
'UPDATE_BYTES_DOWNLOADED': '{center}{grey-fg}{current} / {total} bytes{/}{/center}',
'UPDATE_TIME_REMAINING': '{center}{grey-fg}Tempo restante: {time}{/}{/center}',
    }
};

let currentLang = 'EN';
const langPath = path.join(__dirname, '../CONFIG/LANG.txt');

try {
    if (fs.existsSync(langPath)) {
        currentLang = fs.readFileSync(langPath, 'utf8').trim().toUpperCase();
        if (currentLang !== 'EN' && currentLang !== 'PT') currentLang = 'EN';
    } else {
        fs.writeFileSync(langPath, currentLang, 'utf8');
    }
} catch (e) {
}

function t(key, replacements = {}) {
    let text = strings[currentLang]?.[key] || strings['EN']?.[key] || key;
    
    Object.keys(replacements).forEach(r => {
        text = text.replace(new RegExp(`{${r}}`, 'g'), replacements[r]);
    });
    
    return text;
}

function setLanguage(lang) {
    if (lang !== 'EN' && lang !== 'PT') return false;
    currentLang = lang;
    try {
        fs.writeFileSync(langPath, lang, 'utf8');
    } catch (e) {}
    return true;
}

function getLanguage() {
    return currentLang;
}

module.exports = { t, setLanguage, getLanguage };