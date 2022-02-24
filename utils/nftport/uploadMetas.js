const fetch = require('node-fetch');
const path = require('path');
const basePath = process.cwd();
const fs = require('fs');

fs.writeFileSync(`${basePath}/build/json/_ipfsMetas.json`, "");
const writer = fs.createWriteStream(`${basePath}/build/json/_ipfsMetas.json`, {
    flags: "a",
});
writer.write("[");
const readDir = `${basePath}/build/json`;
let fileCount = fs.readdirSync(readDir).length - 2;

fs.readdirSync(`${basePath}/build/json`).forEach(async (file) => {
    if (file === '_metadata.json' || file === '_ipfsMetas.json')
        return;

    const jsonFile = fs.readFileSync(`${readDir}/${file}`);

    let url = 'https://api.nftport.xyz/v0/metadata';

    let options = {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
            "Authorization": 'ec1cbedd-2c44-42ed-93d2-15a225494355',
        },
        body: jsonFile,
    };

    // fetch(url, options)
    //     .then(res => res.json())
    //     .then(json => {
    //         writer.write(JSON.stringify(json, null, 2));
    //         fileCount--;
    //
    //         if(fileCount === 0) {
    //             writer.write("]")
    //             writer.end()
    //         } else {
    //             writer.write(",\n")
    //         }
    //
    //         console.log(`${json.name} metadata uploaded & added to _ipfsMetas.json!`);
    //
    //     })
    //     .catch(err => console.error('error:' + err));

    let response = await fetch(url, options);
    if (response.ok) {
        let json = await response.json()
            writer.write(JSON.stringify(json, null, 2));
            fileCount--;

            if(fileCount === 0) {
                writer.write("]")
                writer.end()
            } else {
                writer.write(",\n")
            }

            console.log(`${json.name} metadata uploaded & added to _ipfsMetas.json!`);
    } else {
        console.log('Response not ok!', response.status)
    }
})
