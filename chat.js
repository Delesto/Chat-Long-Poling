module.exports = {
    clients: [],
    subscribe(req, res) {
        console.log('subscribe!');
        this.clients.push(res);

        res.on('close', () => {
            this.clients.splice(this.clients.indexOf(res), 1);
        })
    },
    publish(message) {
        this.clients.forEach((res) => {
            res.end(JSON.stringify(message));
        });

        this.clients = [];
    }
}