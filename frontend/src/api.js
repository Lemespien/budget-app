import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:5000/',
    json: true
})

export default {
    async execute(method, resource, data) {
        // inject the accessToken for each request
        return client({
            method,
            url: resource,
            data,
        }).then(req => {
            return req.data
        })
    },

    getItems() {
        return this.execute('get', '/api/v1/Items')
    },
    getItem(id) {
        return this.execute('get', `/api/v1/Items/${id}`)
    },
    createItem(data) {
        return this.execute('post', '/api/v1/Items', data)
    },
    updateItem(id, data) {
        return this.execute('put', `/api/v1/Items/${id}`, data)
    },
    deleteItem(id) {
        return this.execute('delete', `/api/v1/Items/${id}`)
    },

    getTotal() {
        return this.execute('get', '/api/v1/GetTotal')
    },
}