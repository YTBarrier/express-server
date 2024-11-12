import express from 'express';
import fs from 'fs/promises';

const router = express.Router();
function dataCheck(object) {
    return new Promise((resolve, reject) => {
        resolve({username: object.username, text: object.text});
    });
}

router.get('/', async (req, res) => {
    try {
        console.log(`Received ${req.method} request from ${req.url}.`);
        const file = await fs.readFile('./messages.json');
        res.json(JSON.parse(file));
    } catch (err) {
        console.log(`${req.method} request failed. (${err})`);
        res.status(500).json({
            "message": "Error reading database."
        });
        res.end();
    }
});

router.post('/', async (req, res) => {
    try {
        console.log(`Recieved ${req.method} request from ${req.url}.`);
        const file = await fs.readFile('./messages.json')
        const obj = await dataCheck(req.body)
        const fileData = JSON.parse(file);
        fileData.data.push(obj);
        
        await fs.writeFile('./messages.json', JSON.stringify(fileData));
        console.log(`Database record saved: {${Object.entries(obj)}}.`);
        res.status(201).end()
    } catch (err) {
        console.log(`${req.method} request failed. (${err})`);
        res.status(500).json({
            "message": "Error handling POST request."
        }).end();
    }
});

router.put('/:id', async (req, res) => {
    try {
        console.log(`Received ${req.method} request from ${req.url}.`);
        const file = await fs.readFile('./messages.json');
        const obj = await dataCheck(req.body);
        const fileData = JSON.parse(file);
        fileData.data[req.params.id - 1] = obj;

        await fs.writeFile('./messages.json', JSON.stringify(fileData));
        console.log(`Database record updated: {${Object.entries(obj)}}.`);
        res.status(201).end()
    } catch (err) {
        console.log(`${req.method} request failed. (${err})`);
        res.status(500).json({
            "message": "Error updating resource."
        }).end();
    }
});

router.delete('/:id', async (req, res) => {
    try {
        console.log(`Received ${req.method} request from ${req.url}.`);
        const file = await fs.readFile('./messages.json');
        const fileData = JSON.parse(file);
        const deletedForLog = fileData.data[req.params.id - 1];
        fileData.data.splice(req.params.id - 1, 1);
        await fs.writeFile('./messages.json', JSON.stringify(fileData));
        console.log(`Successfully deleted resource: {${Object.entries(deletedForLog)}}.`)
        res.status(204).end();
    }  catch (err) {
        console.log(`${req.method} request failed. (${err})`);
        res.status(500).json({
            "message": "Error deleting resource."
        }).end();
    }
});

router.delete('/', async (req, res) => {
    try {
        console.log(`Received ${req.method} request from ${req.url}.`);
        const emptyDB = {
            data: [],
        }
        await fs.writeFile('./messages.json', JSON.stringify(emptyDB));
        res.status(204).end();
    } catch (err) {
        console.log(`${req.method} request failed. (${err})`);
        res.status(500).json({
            "message": "Error clearing database."
        }).end();
    }
});

export default router;