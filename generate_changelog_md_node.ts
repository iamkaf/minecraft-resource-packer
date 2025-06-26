import * as fs from 'fs/promises';
import * as path from 'path';
import { OUTPUT_JSON_PATH as DEFAULT_INPUT_JSON_PATH, PackFormatEntry } from './fetch_parse_minecraft_wiki';

const OUTPUT_MD_PATH: string = path.join(__dirname, 'docs', 'minecraft', 'resource_pack_format_changelog.md');

async function generateMarkdown(
    inputJsonPath: string = DEFAULT_INPUT_JSON_PATH,
    outputMdPath: string = OUTPUT_MD_PATH
): Promise<boolean> {
    console.log(`Reading data from ${inputJsonPath}...`);
    let packData: PackFormatEntry[];
    try {
        const jsonData = await fs.readFile(inputJsonPath, 'utf-8');
        packData = JSON.parse(jsonData) as PackFormatEntry[];
    } catch (error: any) {
        console.error(`Error reading or parsing JSON file ${inputJsonPath}: ${error.message}`);
        return false;
    }

    if (!packData || packData.length === 0) {
        console.log("No data to generate changelog.");
        return false;
    }
    console.log(`Data read successfully. Generating Markdown for ${outputMdPath}...`);

    let mdContent = "# Minecraft Resource Pack Format Changelog\n\n";
    mdContent += "This document outlines the significant changes for each resource pack format version in Minecraft: Java Edition. ";
    mdContent += "Changes from development snapshots are generally attributed to the pack format version they belong to, or the subsequent release if the format version itself was not part of a final release.\n\n";
    mdContent += "---\n\n";

    for (let i = 0; i < packData.length; i++) {
        const entry = packData[i];
        const value = entry.value || 'N/A';
        let releases = (entry.releases || 'N/A').trim();
        let changes = (entry.changes || 'No specific changes listed.').trim();

        if (!changes) {
            changes = "No specific changes listed.";
        }

        if (releases === "Development Snapshots" || releases === "\u2013" || !releases) {
            let nextReleaseStr = "";
            if (i + 1 < packData.length) {
                const nextEntryReleases = (packData[i+1]?.releases || '').trim();
                if (nextEntryReleases && nextEntryReleases !== "Development Snapshots" && nextEntryReleases !== "\u2013") {
                    nextReleaseStr = ` (leading to ${nextEntryReleases})`;
                }
            }
            mdContent += `## Pack Format ${value} (Development Snapshots${nextReleaseStr})\n\n`;
            mdContent += `**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.\n\n`;
        } else {
            mdContent += `## Pack Format ${value}\n\n`;
            mdContent += `**Releases:** ${releases}\n\n`;
        }

        mdContent += "**Significant Changes:**\n";

        if (changes.startsWith("- ") || changes.includes("\n- ")) {
            mdContent += changes + "\n\n";
        } else {
            const lines = changes.split('\n').map(line => line.trim()).filter(line => line);
            if (lines.length > 1) {
                 lines.forEach(line => mdContent += `- ${line}\n`);
            } else if (lines.length === 1){
                 mdContent += `- ${lines[0]}\n`;
            } else {
                 mdContent += `- No specific changes listed.\n`;
            }
            mdContent += "\n";
        }

        mdContent += "---\n\n";
    }

    mdContent += "*This changelog is based on information from the [Minecraft Wiki](https://minecraft.wiki/w/Pack_format).*\n";

    try {
        const outputDir = path.dirname(outputMdPath);
        await fs.mkdir(outputDir, { recursive: true });
        await fs.writeFile(outputMdPath, mdContent, 'utf-8');
        console.log(`Successfully generated changelog at ${outputMdPath}`);
        return true;
    } catch (error: any) {
        console.error(`Error writing Markdown to file ${outputMdPath}: ${error.message}`);
        return false;
    }
}

if (require.main === module) {
    generateMarkdown()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(err => {
            console.error("Unhandled error in generateMarkdown:", err);
            process.exit(1);
        });
}

export { generateMarkdown };
