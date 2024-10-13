const axios = require("axios");

const resolvers = {
  Query: {
    users: async () => {
      const response = await axios.get("http://localhost:3001/api/users");
      const users = response.data;
      return users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
      }));
    },
    user: async (_, { email }) => {
      try {
        // Fetch user data from external service
        const response = await axios.get(`http://localhost:3001/api/users/${email}`);
        
        // If the request is successful, map the response to the expected structure
        if (response.status === 200 && response.data.length > 0) {
          const user = response.data[0];  // Pick the first user from the array
    
          // Return the user object with id, name, and email
          return {
            id: user._id,  // Use _id from the API response
            name: user.name,
            email: user.email,
          };
        }
    

        // In case the user is not found or an error occurred, return an Error object
        return {
          message: "User not found or error fetching user."
        };
      } catch (error) {
        console.error("Error in user resolver:", error.message);

        // Return an Error object in case of failure
        return {
          message: "Failed to fetch user information"
        };
      }
    },
    product: async (_, { id }) => {
      const response = await axios.get(`http://localhost:3002/products/${id}`);
      return response.data;
    },
    orders: async () => {
      const response = await axios.get("http://localhost:3004/orders");
      const orders = response.data;
      return orders.map((order) => ({
        id: order._id,
        status: order.status,
        quantity: order.quantity,
        userId: order.userId,
        productId: order.productId,
      }));
    },
    order: async (_, { id }) => {
      const response = await axios.get(`http://localhost:3004/orders/${id}`);
      return response.data;
    },
  },

  Mutation: {
    registerUser: async (_, { input }) => {
      try {
        const response = await axios.post("http://localhost:3001/users", input);
        const user = response.data[0];

        // Log the user response for debugging
        console.log(user);

        // Check the message from the API response
        if (user.message !== "Ok Success") {
          console.error("User registration not allowed");
          throw new Error("Failed to register user");
        }

        // Return the necessary fields including id, name, and email
        return {
          id: user.id, // Include the id field here
          name: user.name,
          email: user.email,
        };
      } catch (error) {
        console.error("Error registering user:", error.message);
        throw new Error("Failed to register user");
      }
    },

    createProduct: async (_, { input }) => {
      const { name, price, inventory } = input;

      // Validate inventory
      if (inventory < 0) {
        throw new Error("Inventory cannot be negative");
      }

      const response = await axios.post(
        "http://localhost:3002/products",
        input
      );
      const productApi = response.data;
      console.log(productApi)
      if (productApi.message !== "Product created successfully") {
        throw new Error("Product not created successfully");
      }
      const product = {
        __typename: 'Product',
        id: productApi.productId,
        name: productApi.name,
        status: "Pending",
        price: productApi.price,
        quantity: productApi.quantity,
      };
      return product;
    },
    placeOrder: async (_, { input }) => {
      const response = await axios.post("http://localhost:3004/orders", input);
      const order = response.data;
      return order;
    },
  },
};

module.exports = resolvers;