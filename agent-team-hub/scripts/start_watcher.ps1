# PowerShell script to start the Team Hub Watcher loop
$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$ScriptDir/.."

$env:PYTHONIOENCODING = "utf-8"
python -m scripts.hub_watcher
