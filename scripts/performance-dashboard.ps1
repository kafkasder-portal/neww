# Performance Dashboard - Real-time Monitoring
# Monitors system performance, bundle size, and development metrics

Write-Host "📊 Performance Dashboard - Real-time Monitoring" -ForegroundColor Yellow
Write-Host "=" * 60 -ForegroundColor Cyan

# Function to get system performance metrics
function Get-SystemMetrics {
    $cpu = Get-Counter '\Processor(_Total)\% Processor Time' -SampleInterval 1 -MaxSamples 1
    $memory = Get-Counter '\Memory\Available MBytes' -SampleInterval 1 -MaxSamples 1
    $disk = Get-Counter '\PhysicalDisk(_Total)\% Disk Time' -SampleInterval 1 -MaxSamples 1
    
    return @{
        CPU    = [math]::Round($cpu.CounterSamples[0].CookedValue, 1)
        Memory = [math]::Round($memory.CounterSamples[0].CookedValue, 0)
        Disk   = [math]::Round($disk.CounterSamples[0].CookedValue, 1)
    }
}

# Function to get Node.js processes
function Get-NodeProcesses {
    $processes = Get-Process | Where-Object { $_.ProcessName -like "*node*" -or $_.ProcessName -like "*npm*" -or $_.ProcessName -like "*vite*" }
    return $processes | ForEach-Object {
        @{
            Name   = $_.ProcessName
            Id     = $_.Id
            CPU    = [math]::Round($_.CPU, 2)
            Memory = [math]::Round($_.WorkingSet64 / 1MB, 1)
        }
    }
}

# Function to get bundle size
function Get-BundleSize {
    if (Test-Path "dist") {
        $totalSize = 0
        Get-ChildItem -Path "dist" -Recurse -File | ForEach-Object {
            $totalSize += $_.Length
        }
        return [math]::Round($totalSize / 1MB, 2)
    }
    return 0
}

# Function to get port usage
function Get-PortUsage {
    $ports = @(3000, 5173, 5176, 5177, 3004, 8000, 8080)
    $usage = @{}
    
    foreach ($port in $ports) {
        $connection = netstat -ano | findstr ":$port "
        if ($connection) {
            $usage[$port] = $true
        }
        else {
            $usage[$port] = $false
        }
    }
    
    return $usage
}

# Function to display metrics
function Show-Metrics {
    param($metrics, $processes, $bundleSize, $portUsage)
    
    Clear-Host
    Write-Host "📊 Performance Dashboard - $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Yellow
    Write-Host "=" * 60 -ForegroundColor Cyan
    
    # System Metrics
    Write-Host "🖥️  System Performance:" -ForegroundColor Cyan
    Write-Host "  CPU Usage: $($metrics.CPU)%" -ForegroundColor $(if ($metrics.CPU -gt 80) { "Red" } elseif ($metrics.CPU -gt 60) { "Yellow" } else { "Green" })
    Write-Host "  Available Memory: $($metrics.Memory) MB" -ForegroundColor $(if ($metrics.Memory -lt 1000) { "Red" } elseif ($metrics.Memory -lt 2000) { "Yellow" } else { "Green" })
    Write-Host "  Disk Usage: $($metrics.Disk)%" -ForegroundColor $(if ($metrics.Disk -gt 80) { "Red" } elseif ($metrics.Disk -gt 60) { "Yellow" } else { "Green" })
    
    Write-Host ""
    
    # Node.js Processes
    Write-Host "🟢 Node.js Processes:" -ForegroundColor Cyan
    if ($processes.Count -gt 0) {
        $processes | ForEach-Object {
            Write-Host "  $($_.Name) (PID: $($_.Id)) - CPU: $($_.CPU)s, Memory: $($_.Memory) MB" -ForegroundColor White
        }
    }
    else {
        Write-Host "  No Node.js processes running" -ForegroundColor Gray
    }
    
    Write-Host ""
    
    # Bundle Size
    Write-Host "📦 Bundle Size:" -ForegroundColor Cyan
    if ($bundleSize -gt 0) {
        $color = if ($bundleSize -gt 5) { "Red" } elseif ($bundleSize -gt 3) { "Yellow" } else { "Green" }
        Write-Host "  Current: $bundleSize MB" -ForegroundColor $color
    }
    else {
        Write-Host "  No build found (run 'npm run build' first)" -ForegroundColor Gray
    }
    
    Write-Host ""
    
    # Port Usage
    Write-Host "🔌 Port Usage:" -ForegroundColor Cyan
    $portUsage.GetEnumerator() | ForEach-Object {
        $status = if ($_.Value) { "In Use" } else { "Available" }
        $color = if ($_.Value) { "Red" } else { "Green" }
        Write-Host "  Port $($_.Key): $status" -ForegroundColor $color
    }
    
    Write-Host ""
    Write-Host "Press Ctrl+C to exit" -ForegroundColor Gray
    Write-Host "=" * 60 -ForegroundColor Cyan
}

# Main monitoring loop
try {
    Write-Host "Starting performance monitoring..." -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop monitoring" -ForegroundColor Yellow
    Start-Sleep -Seconds 2
    
    while ($true) {
        $metrics = Get-SystemMetrics
        $processes = Get-NodeProcesses
        $bundleSize = Get-BundleSize
        $portUsage = Get-PortUsage
        
        Show-Metrics -metrics $metrics -processes $processes -bundleSize $bundleSize -portUsage $portUsage
        
        Start-Sleep -Seconds 5
    }
}
catch {
    Write-Host ""
    Write-Host "Monitoring stopped." -ForegroundColor Yellow
    Write-Host "Performance Dashboard closed." -ForegroundColor Green
}
