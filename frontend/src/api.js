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
    getTodos() {
        return this.execute('get', '/api/v1/todosAsync')
    },
    getTodo(id) {
        return this.execute('get', `/api/v1/todos/${id}`)
    },
    createTodo(data) {
        return this.execute('post', '/api/v1/todos', data)
    },
    updateTodo(id, data) {
        return this.execute('put', `/api/v1/todosAsync/${id}`, data)
    },
    deleteTodo(id) {
        return this.execute('delete', `/api/v1/todos/${id}`)
    },

    getItems() {
        return this.execute('get', '/api/v1/mySQLitems')
    },
    getItem(id) {
        return this.execute('get', `/api/v1/mySQLitems/${id}`)
    },
    createItem(data) {
        return this.execute('post', '/api/v1/mySQLitems', data)
    },
    updateItem(id, data) {
        return this.execute('put', `/api/v1/mySQLitems/${id}`, data)
    },
    deleteItem(id) {
        return this.execute('delete', `/api/v1/mySQLitems/${id}`)
    },

    getTotal() {
        return this.execute('get', '/api/v1/mySQLgetTotal')
    },
}