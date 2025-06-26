import axios from 'axios'; // Re-added axios
import * as cheerio from 'cheerio';
import * as fs from 'fs/promises';
import * as path from 'path';

const REMOTE_URL = 'https://minecraft.wiki/w/Pack_format';
const LOCAL_HTML_FILE_PATH: string = path.join(__dirname, 'pack_format_page.html');
const OUTPUT_JSON_PATH: string = path.join(__dirname, 'minecraft_resource_pack_data.json');

interface PackFormatEntry {
    value: string;
    releases: string;
    changes: string;
}

function cleanText(text: string | null | undefined): string {
    if (!text) return '';
    return text.replace(/\s+/g, ' ').trim();
}

async function getHtmlContent(): Promise<string | null> {
    console.log(`Attempting to fetch HTML data from ${REMOTE_URL}...`);
    try {
        const { data: htmlContent } = await axios.get(REMOTE_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        console.log('Remote HTML data fetched successfully.');
        return htmlContent;
    } catch (error: any) {
        console.warn(`Failed to fetch remote HTML: ${error.message}. Attempting to use local fallback.`);
        try {
            const localHtmlContent = await fs.readFile(LOCAL_HTML_FILE_PATH, 'utf-8');
            console.log(`Local HTML data read successfully from ${LOCAL_HTML_FILE_PATH}.`);
            return localHtmlContent;
        } catch (localError: any) {
            console.error(`Error reading local HTML file ${LOCAL_HTML_FILE_PATH}: ${localError.message}`);
            return null;
        }
    }
}

async function fetchAndParse(): Promise<PackFormatEntry[] | null> {
    const htmlContent = await getHtmlContent();

    if (!htmlContent) {
        console.error("Failed to get HTML content from both remote and local sources.");
        return null;
    }

    console.log('Parsing HTML content...');
    try {
        const $ = cheerio.load(htmlContent);
        const resourcePackFormats: PackFormatEntry[] = [];

        const resourcePacksHeading = $('#List_of_resource_pack_formats');
        if (resourcePacksHeading.length === 0) {
            console.error("Could not find the 'List of resource pack formats' heading.");
            return null;
        }

        const h2Element = resourcePacksHeading.closest('h2');
        if (h2Element.length === 0) {
            console.error("Could not find the parent H2 of the resource pack formats heading.");
            return null;
        }

        let tableElement = h2Element.nextAll('table.wikitable').first();
        if (tableElement.length === 0) {
            console.log("Could not find 'table.wikitable' using nextAll. Trying direct next sibling of H2 parent...");
            tableElement = h2Element.next('table.wikitable');
            if (tableElement.length === 0) {
                 console.log("Could not find 'table.wikitable' as direct next sibling. Trying generic 'table'...");
                tableElement = h2Element.nextAll('table').first();
                 if (tableElement.length === 0) {
                    tableElement = h2Element.next('table');
                    if (tableElement.length === 0) {
                        console.error("Could not find the resource pack formats table with various selectors.");
                        return null;
                    }
                 }
            }
        }

        if (tableElement.length === 0) {
            console.error("Resource pack formats table could not be identified.");
            return null;
        }

        console.log("Resource pack formats table identified.");
        const rows = tableElement.find('tr');

        rows.each((i, row) => {
            if (i === 0) return; // Skip header row

            const $row = $(row);
            const cols = $row.find('th, td');

            if (cols.length < 4) return;

            const value = cleanText(cols.eq(0).text());
            let releases = cleanText(cols.eq(2).text());

            const changesCol = cols.eq(3);
            let changesHtml = changesCol.html();

            if (changesHtml === null) changesHtml = ''; // Ensure changesHtml is not null

            const $changes = cheerio.load(`<div>${changesHtml}</div>`);

            $changes('a').each((_, el) => {
                const $el = $(el);
                let href = $el.attr('href') || '';
                const text = cleanText($el.text());
                if (href.startsWith('/w/')) {
                    href = `https://minecraft.wiki${href}`;
                    $el.replaceWith(`[${text}](${href})`);
                } else {
                    $el.replaceWith(text);
                }
            });

            $changes('code, samp').each((_, el) => {
                const $el = $(el);
                const text = cleanText($el.text());
                $el.replaceWith(`\`${text}\``);
            });

            let changesTextItems: string[] = [];
            if ($changes('ul').length > 0) {
                $changes('ul > li').each((_, li) => {
                    changesTextItems.push(`- ${cleanText($($changes(li)).text())}`);
                });
            }

            let finalChanges: string;
            if (changesTextItems.length > 0) {
                finalChanges = changesTextItems.join('\n');
            } else {
                finalChanges = cleanText($changes('div').text()); // Get text from the wrapping div
            }

            if (value.match(/^\d+$/)) {
                 if (releases === '–') {
                    releases = "Development Snapshots";
                }
                resourcePackFormats.push({
                    value,
                    releases,
                    changes: finalChanges
                });
            }
        });

        console.log(`Parsing complete. Found ${resourcePackFormats.length} entries.`);
        return resourcePackFormats;

    } catch (error: any) {
        console.error(`Error parsing HTML content: ${error.message}`);
        return null;
    }
}

async function main(): Promise<void> {
    const parsedData = await fetchAndParse();
    if (parsedData && parsedData.length > 0) {
        try {
            await fs.writeFile(OUTPUT_JSON_PATH, JSON.stringify(parsedData, null, 2), 'utf-8');
            console.log(`Successfully parsed ${parsedData.length} resource pack format entries.`);
            console.log(`Data saved to ${OUTPUT_JSON_PATH}`);
            process.exit(0);
        } catch (error: any) {
            console.error(`Error writing JSON to file: ${error.message}`);
            process.exit(1);
        }
    } else {
        console.log("No resource pack data was parsed or an error occurred during fetching/parsing.");
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

export { fetchAndParse, cleanText, OUTPUT_JSON_PATH, PackFormatEntry };
