<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">Todos Manager</h1>
    <b-alert :show="loading" variant="info">Loading...</b-alert>
    <b-row>
      <b-col>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="todo in todos.combinedTodo" :key="todo.todoId">
              <td>{{ todo.todoId || todo.id }}</td>
              <td>{{ todo.title }}</td>
              <td>{{ todo.description || "no description available" }}</td>
              <td>{{ todo.createdAt }}</td>
              <td>{{ todo.updatedAt }}</td>
              <td class="text-right">
                <a href="#" @click.prevent="populateTodoToEdit(todo)">Edit</a> -
                <a href="#" @click.prevent="deleteTodo(todo.todoId)">Delete</a>
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>
      <b-col lg="3">
        <b-card :title="(model.todoId ? 'Edit Todo ID#' + model.todoId : 'New Todo')">
          <form @submit.prevent="saveTodo">
            <b-form-group label="Title">
              <b-form-input type="text" v-model="model.title"></b-form-input>
            </b-form-group>
            <b-form-group label="Description">
              <b-form-textarea rows="4" v-model="model.description"></b-form-textarea>
            </b-form-group>
            <div>
              <b-btn type="submit" variant="success">Save Todo</b-btn>
              <p>{{status}}</p>
            </div>
          </form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import api from "@/api";

export default {
  name: "TodoManger",
  data() {
    return {
      loading: false,
      todos: [],
      status: "success",
      model: {}
    };
  },
  async created() {
    this.refreshTodos();
  },
  methods: {
    async refreshTodos() {
      this.loading = true;
      this.todos = await api.getTodos();
      this.loading = false;
    },
    async populateTodoToEdit(Todo) {
      this.model = Object.assign({}, Todo);
    },
    async saveTodo() {
      if (this.model.id) {
        await api.updateTodo(this.model.id, this.model).catch(err => {
          this.status = "A todo with that title already exists!";
        });
      } else {
        await api.createTodo(this.model);
      }
      this.model = {}; // reset form
      await this.refreshTodos();
    },
    async deleteTodo(id) {
      if (confirm("Are you sure you want to delete this Todo?")) {
        // if we are editing a Todo we deleted, remove it from the form
        if (this.model.todoId === id) {
          this.model = {};
        }
        await api.deleteTodo(id);
        await this.refreshTodos();
      }
    }
  }
};
</script>