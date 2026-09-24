const COLORS = {
    primary: "white",
    secondary: "gray",
    success: "green",
    warning: "yellow",
    error: "red",
    inverted: "black",
    black: "black",
    white: "white",
    gray: "gray",
    red: "red",
    green: "green",
    blue: "blue",
    yellow: "yellow",
    magenta: "magenta",
    cyan: "cyan",
    orange: "orange",
    pink: "pink",
    purple: "purple",
} as const;

type Colors = typeof COLORS;

const packagelist: string[] = [
    "node",
    "appraise",
    "authkey",
    "bettercap",
    "crack",
    "clearlogs",
    "curl",
    "decode",
    "dirhunter",
    "dnshistory",
    "geoip",
    "git",
    "hashcat",
    "hydra",
    "john",
    "launder",
    "lynx",
    "market",
    "metasploit",
    "mxlookup",
    "nuclei",
    "openssl",
    "openvpn",
    "pip",
    "pivot",
    "probe",
    "python3",
    "subfinder",
    "watch",
    "weechat"
];

const hackdblist: { name: string; ext: string }[] = [
    { name: "fern", ext: ".py" },
    { name: "jwt_decoder", ext: ".py" },
    { name: "kimai", ext: ".py" },
    { name: "Liberty Central Bank Form", ext: ".html" },
    { name: "net_tree", ext: ".py" },
    { name: "pret", ext: ".py" },
    { name: "pyUserEnum", ext: ".py" },
    { name: "sqlmap", ext: ".py" },
    { name: "Twotter Form", ext: ".html" },
    { name: "wiglenet", ext: ".py" },
    { name: "wordlist", ext: ".lst" }
];

async function installPackage(pkg: string): Promise<boolean> {
    try {
        println({ text: `[+] Installing package: ${pkg}...`, color: COLORS.red });
        const install = await Shell.Process.exec(`apt-get install ${pkg}`);
        const output = install === null || install === undefined ? "" : String(install).toLowerCase();

        if (output.includes("error") || output.includes("not found") || output.includes("failed")) {
            println({ text: `[!] Failed to install ${pkg}`, color: COLORS.error });
            return false;
        } else {
            println({ text: `[✓] ${pkg} installed successfully!`, color: COLORS.cyan });
            return true;
        }
    } catch (err) {
        println({ text: `[!] Error installing ${pkg}: ${String(err)}`, color: COLORS.error });
        return false;
    }
}

async function Main() {
    println({ text: "==========================================", color: COLORS.red });
    println({ text: "      Starting Automated Installer        ", color: COLORS.warning });
    println({ text: "==========================================", color: COLORS.red });

    // Phase 1: Install all system packages
    for (const pkg of packagelist) {
        await installPackage(pkg);
    }

    // Phase 2: Download all HackDB scripts to downloads folder
    println({ text: "------------------------------------------", color: COLORS.secondary });
    println({ text: "[+] Downloading all HackDB exploits...", color: COLORS.warning });
    println({ text: "------------------------------------------", color: COLORS.secondary });

    for (const item of hackdblist) {
        try {
            println({ text: `[+] Downloading: ${item.name}...`, color: COLORS.red });
            await HackDB.DownloadExploit(item.name);
            println({ text: `[✓] Downloaded ${item.name}`, color: COLORS.cyan });
        } catch (err) {
            println({ text: `[!] Failed to download ${item.name}: ${String(err)}`, color: COLORS.error });
        }
    }

    println({ text: "==========================================", color: COLORS.red });
    println({ text: "       All Downloads Complete!            ", color: COLORS.warning });
    println({ text: "==========================================", color: COLORS.red });

    // Wait 5 seconds to ensure all files finish saving to disk
    println({ text: "[*] Waiting 15 seconds for files to sync...", color: COLORS.secondary });
    await new Promise(resolve => setTimeout(resolve, 15000));

    // Phase 3: Move all downloaded files from downloads into /lib
    println({ text: "------------------------------------------", color: COLORS.secondary });
    println({ text: "[+] Moving all files to /lib...", color: COLORS.warning });
    println({ text: "------------------------------------------", color: COLORS.secondary });

    for (const item of hackdblist) {
        const filename = `${item.name}${item.ext}`;
        const sourcePath = `/home/djreucroft/downloads/${filename}`;
        try {
            await Shell.Process.exec(`mv "${sourcePath}" /lib/`);
            println({ text: `[✓] Moved ${filename} to /lib`, color: COLORS.cyan });
        } catch (err) {
            println({ text: `[!] Failed to move ${filename}: ${String(err)}`, color: COLORS.error });
        }
    }

    println({ text: "==========================================", color: COLORS.red });
    println({ text: "       Setup & Organization Complete! :D  ", color: COLORS.cyan });
    println({ text: "==========================================", color: COLORS.red });
}

await Main();
