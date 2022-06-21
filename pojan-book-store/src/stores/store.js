import { defineStore } from "pinia";
import swal from "sweetalert";
import axios from "axios";

export const useStore = defineStore({
  id: "store",
  state: () => ({
    baseUrl: "http://localhost:3000",
    isLogin: false,
    products: [],
    productsObj: {},
    wishlists: [],
    categories: [],
    accessToken: "",
    product: null,
  }),
  getters: {},
  actions: {
    async fetchProducts(obj) {
      try {
        const { page, name, categoryId, minPrice, maxPrice } = obj;
        const response = await axios.get(`${this.baseUrl}/books`, {
          params: {
            page,
            name,
            categoryId,
            minPrice,
            maxPrice,
          },
        });
        this.products = response.data.data.products;
        this.productsObj = response.data.data;
      } catch (err) {
        this.showError(err);
      }
    },
    async fetchOneProduct(id) {
      try {
        const response = await axios.get(`${this.baseUrl}/books/${id}`);
        this.product = response.data.data;
        this.router.push({
          name: "Product Detail",
          params: {
            BookId: id,
          },
        });
      } catch (err) {
        this.router.push({
          name: "NotFound",
        });
      }
    },
    async fetchWishlists() {
      try {
        const response = await axios.get(`${this.baseUrl}/wishlists`, {
          headers: {
            access_token: this.accessToken,
          },
        });
        this.wishlists = response.data.data;
      } catch (err) {
        this.showError(err);
      }
    },
    async addWishlists(productId) {
      try {
        await axios.post(`${this.baseUrl}/wishlists/${productId}`, null, {
          headers: {
            access_token: this.accessToken,
          },
        });
        swal({
          title: "Success add book to your wishlists",
          icon: "success",
        });
        this.fetchWishlists();
      } catch (err) {
        this.showError(err);
      }
    },
    async removeWishlists(productId) {
      try {
        await axios.delete(`${this.baseUrl}/wishlists/${productId}`, {
          headers: {
            access_token: this.accessToken,
          },
        });
        swal({
          title: "Success remove book from your wishlists",
          icon: "success",
        });
        this.fetchWishlists();
      } catch (err) {
        this.showError(err);
      }
    },
    async loginHandler(userObj) {
      try {
        const user = await axios.post(`${this.baseUrl}/login`, userObj);
        this.afterLogin(user);
      } catch (err) {
        this.showError(err);
      }
    },
    async registerHandler(userObj) {
      try {
        await axios.post(`${this.baseUrl}/register`, userObj);
        this.moveToRoute("Login");
        swal({
          title: `Registration success, you can login now`,
          icon: "success",
        });
      } catch (err) {
        this.showError(err);
      }
    },
    logoutHandler() {
      this.isLogin = false;
      localStorage.clear();
      this.moveToRoute("Home");
      swal({
        title: `Logout success!`,
        icon: "success",
      });
    },
    showError(err) {
      console.log(err);
      const msg = err.response.data.error.message;
      if (Array.isArray(msg)) {
        swal(msg.join("\n"));
      } else {
        swal(msg);
      }
    },
    moveToRoute(routeName) {
      this.router.push({
        name: routeName,
      });
    },
    async handleCredentialResponse(response) {
      try {
        const { credential } = response;
        const user = await axios.post(`${this.baseUrl}/google-sign`, {
          credential,
        });
        this.afterLogin(user);
      } catch (err) {
        this.showError(err);
      }
    },
    googleSignIn() {
      const cb = this.handleCredentialResponse;
      google.accounts.id.initialize({
        client_id:
          "947779996052-tjgqvkf3cd9u0odhknu62l1onldi5b1l.apps.googleusercontent.com",
        callback: cb,
      });
      google.accounts.id.renderButton(
        document.getElementById("google-sign-in"),
        { theme: "outline", size: "large" }
      );
    },
    afterLogin(user) {
      const { accessToken, email, id, username } = user.data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("UserId", id);
      localStorage.setItem("UserEmail", email);
      this.isLogin = true;
      this.accessToken = accessToken;
      this.moveToRoute("Home");
      swal({
        title: username ? `Welcome, ${username}!` : "Welcome!",
        icon: "success",
      });
    },
    async fetchCategories() {
      try {
        const response = await axios.get(`${this.baseUrl}/categories`);
        this.categories = response.data.data;
      } catch (err) {
        this.showError(err);
      }
    },
  },
});