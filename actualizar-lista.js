const fs = require('fs');

async function convertirLista() {
    const url = "https://raw.githubusercontent.com/easylist/easylist/master/easylist/easylist_adservers.txt";
    console.log("Descargando lista de la comunidad...");
    
    try {
        const response = await fetch(url);
        const texto = await response.text();
        
        const lineas = texto.split('\n');
        const rules = [];
        let id = 10000; 

        for (let linea of lineas) {
            linea = linea.trim();
            if (linea.startsWith('||') && linea.includes('^') && !linea.includes('!')) {
                let dominio = linea.replace('||', '').replace('^', '').split('$')[0];
                
                if (dominio.length > 3) {
                    rules.push({
                        "id": id++,
                        "priority": 1,
                        "action": { "type": "block" },
                        "condition": {
                            "urlFilter": `||${dominio}^`,
                            "resourceTypes": ["script", "sub_frame", "image", "xmlhttprequest"]
                        }
                    });
                }
            }
        }
        const reglasFinales = rules.slice(0, 5000);
        fs.writeFileSync('community_rules.json', JSON.stringify(reglasFinales, null, 2));
        console.log(`¡Listo! Se generaron ${reglasFinales.length} reglas.`);
    } catch (error) {
        console.error("Error:", error);
    }
}

convertirLista();
