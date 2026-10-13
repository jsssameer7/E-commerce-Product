Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead('C:\Users\SAMEER\Downloads\Electronics_Shopping_Portal_Project_Report.docx')
$entry = $zip.GetEntry('word/document.xml')
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xml = $reader.ReadToEnd()
$reader.Close()
$zip.Dispose()
$bothMatches = [regex]::Matches($xml, 'w:val="both"')
Write-Host "Exact count of Justified paragraphs (<w:jc w:val=`"both`"/>):" $bothMatches.Count
