<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">Items Manager</h1>
    <b-alert :show="loading" variant="info">Loading...</b-alert>
    <b-row>
      <b-col>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Order</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total Cost</th>
              <th>Purchased On</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items.result" :key="item.itemID">
              <td>{{ item.itemName }}</td>
              <td>{{ item.categoryName }}</td>
              <td>{{ item.orderID }}</td>
              <td>{{ item.itemQuantity }}</td>
              <td>{{ item.itemPrice }}</td>
              <td>{{ item.itemTotal }}</td>
              <td>{{ item.itemPurchaseDate }}</td>
              <td class="text-right">
                <a href="#" @click.prevent="populateItemToEdit(item)">Edit</a> -
                <a href="#" @click.prevent="deleteItem(item.itemID)">Delete</a>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr v-for="itemTotal in total.result" :key="itemTotal.itemID">
              <th>{{ itemTotal.itemName }} Total:</th>
              <th>&nbsp;</th>
              <th>&nbsp;</th>
              <th>{{ itemTotal.totalQuantity }}</th>
              <th>&nbsp;</th>
              <th>{{ itemTotal.total }}</th>
              <th>&nbsp;</th>
            </tr>
          </tfoot>
        </table>
      </b-col>
      <b-col lg="3">
        <b-card :title="(model.itemID ? 'Edit Item ID#' + model.itemID : 'New Item')">
          <form @submit.prevent="saveItem">
            <b-form-group label="Item">
              <b-form-input type="text" v-model="model.itemName"></b-form-input>
            </b-form-group>
            <b-form-group label="Quantity">
              <b-form-input type="number" v-model="model.itemQuantity"></b-form-input>
            </b-form-group>
            <b-form-group label="Price">
              <b-form-input type="number" v-model="model.itemPrice"></b-form-input>
            </b-form-group>
            <b-form-group label="Order #">
              <b-form-input type="number" v-model="model.orderID"></b-form-input>
            </b-form-group>
            <b-form-group label="Category">
              <b-form-select v-model="model.categoryName" :options="options"></b-form-select>
            </b-form-group>
            <div>
              <b-btn type="submit" variant="success">Save Item</b-btn>
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
  name: "ItemManger",
  data() {
    return {
      loading: false,
      items: [],
      total: [],
      status: "",
      model: {
        categoryName: null
      },
      options: [
        { value: undefined, text: "Please select a category" },
        { value: "Food", text: "Food" },
        { value: "Entertainment", text: "Entertainment" },
        { value: "Medical", text: "Medical" },
        { value: "Essentials", text: "Essentials" },
        { value: "Other", text: "Other" }
      ]
    };
  },
  async created() {
    this.refreshItems();
  },
  methods: {
    async refreshItems() {
      this.loading = true;
      this.items = await api.getItems();
      this.total = await api.getTotal();
      this.loading = false;
    },
    async populateItemToEdit(item) {
      this.model = Object.assign({}, item);
    },
    async saveItem() {
      if (this.model.itemID) {
        await api.updateItem(this.model.itemID, this.model).catch(err => {
          this.status = "A item with that title already exists!";
        });
      } else {
        await api.createItem(this.model);
      }
      console.log(this.model);
      //await api.createItem(this.model);
      this.model = {}; // reset form
      await this.refreshItems();
    },
    async deleteItem(id) {
      if (confirm("Are you sure you want to delete this Item?")) {
        // if we are editing a Item we deleted, remove it from the form
        if (this.model.itemID === id) {
          this.model = {};
        }
        await api.deleteItem(id);
        await this.refreshItems();
      }
    },
    updateButtonText(category) {
      this.selected = category;
      this.model.categoryName = category;
      return;
    }
  }
};
</script>