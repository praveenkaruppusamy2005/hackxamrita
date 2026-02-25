const translate = require('google-translate-api-x');

async function test() {
    try {
        const res = await translate(["Hello", "How are you?"], { to: 'ta', client: 'gtx' });
        console.log(JSON.stringify(res, null, 2));
    } catch (err) {
        console.error("ERROR:", err);
    }
}

test();
