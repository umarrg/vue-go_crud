<template>
  <v-app class="blue-grey lighten-5">
    <v-container>
      <v-row>
        <v-col cols="12" md="12">
          <v-data-table
            :headers="headers"
            :items="student"
            :loading="loading1"
            hide-default-footer
            class="custom_card"
          >
            <template v-slot:top>
              <v-toolbar flat rounded="lg">
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      class="mb-2"
                      v-bind="attrs"
                      v-on="on"
                    >
                      Add Student
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="text-h6 ml-2">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" md="12" class="py-0">
                            <v-text-field
                              v-model="editedItem.firstName"
                              label="First Name"
                              outlined
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="12" class="py-0">
                            <v-text-field
                              v-model="editedItem.lastName"
                              label="Last Name"
                              outlined
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="12">
                            <v-text-field
                              v-model="editedItem.email"
                              label="Email"
                              outlined
                              type="email"
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6" class="py-0">
                            <v-text-field
                              v-model="editedItem.age"
                              label="Age"
                              outlined
                              type="number"
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6" class="py-0">
                            <v-select
                              :items="items"
                              v-model="editedItem.gender"
                              outlined
                              dense
                              label="Gender"
                            ></v-select>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" text @click="close">
                        Cancel
                      </v-btn>
                      <v-btn
                        color="primary"
                        text
                        @click="save"
                        :loading="loading2"
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                  <v-card>
                    <v-card-title class="text-h6"
                      >Are you sure you want to delete this
                      Student?</v-card-title
                    >
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" text @click="closeDelete"
                        >Cancel</v-btn
                      >
                      <v-btn
                        color="primary"
                        text
                        @click="deleteItemConfirm(delItem)"
                        >YES</v-btn
                      >
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn small color="primary" class="mr-2" @click="editItem(item)">
                edit
              </v-btn>
              <v-btn small color="primary" @click="deleteItem(item)">
                delete
              </v-btn>
            </template>
            <template v-slot:[`item.name`]="{ item }">
              <span>{{ item.firstName }} {{ item.lastName }}</span>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<script>
// @ is an alias to /src
import axios from "axios";
export default {
  name: "Home",
  components: {},
  data: () => ({
    dialog: false,

    loading1: false,
    delItem: {},
    views: [],
    loading2: false,
    dialogDelete: false,
    items: ["male", "female"],
    headers: [
      {
        text: "ID",
        align: "start",
        sortable: false,
        value: "id",
        class: "grey lighten-4",
      },
      {
        text: "Name",

        sortable: false,
        value: "name",
        class: "grey lighten-4",
      },
      {
        text: "Email",
        value: "email",
        sortable: false,
        class: "grey lighten-4",
      },
      {
        text: "Gender",
        value: "gender",
        sortable: false,
        class: "grey lighten-4",
      },
      { text: "Age", value: "age", sortable: false, class: "grey lighten-4" },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        class: "grey lighten-4",
      },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      firstName: "",
      lastName: "",
      email: "",
      age: "",
      gender: "",
      id: 0,
    },

    student: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Student" : "Edit Student";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    dialogView(val) {
      val || this.closeView();
    },
  },

  methods: {
    fetchStudent() {
      this.loading1 = true;
      axios
        .get("http://localhost:3000/student", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          this.loading1 = false;
          this.student = res.data;
        })
        .catch((err) => console.log(err));
    },

    editItem(item) {
      this.editedIndex = this.student.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    view(item) {
      this.views = item;
      this.dialogView = true;
    },

    deleteItem(item) {
      this.delItem = item;
      this.editedIndex = this.student.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm(item) {
      axios
        .delete(`http://localhost:3000/student/${item.id}`)
        .then((res) => {
          this.student.splice(this.editedIndex, 1);
          console.log(res);
        })
        .catch((err) => {
          console.log(err), (this.loading2 = false);
        });

      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeView() {
      this.dialogView = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        this.loading2 = true;
        const data = {
          firstName: this.editedItem.firstName,
          lastName: this.editedItem.lastName,
          email: this.editedItem.email,
          age: JSON.parse(this.editedItem.age),
          gender: this.editedItem.gender,
        };
        axios
          .put(`http://localhost:3000/student/${this.editedItem.id}`, data)
          .then((res) => {
            this.loading2 = false;
            alert("student updated sucessfully");
            this.$router.go();
            console.log(res);
          })
          .catch((err) => {
            alert(err);
            console.log(err), (this.loading2 = false);
          });
      } else {
        this.loading2 = true;
        const data = {
          firstName: this.editedItem.firstName,
          lastName: this.editedItem.lastName,
          email: this.editedItem.email,
          age: JSON.parse(this.editedItem.age),
          gender: this.editedItem.gender,
          id: 0,
        };
        axios
          .post("http://localhost:3000/student", data)
          .then((res) => {
            this.loading2 = false;
            alert("student added sucessfully");
            this.$router.go();
            console.log(res);
          })
          .catch((err) => {
            alert(err);
            console.log(err), (this.loading2 = false);
          });
      }
      this.close();
    },
  },
  mounted() {
    this.fetchStudent();
  },
};
</script>
<style>
.custom__bg {
  background: #e8eaf6;
}

.custom_card {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
}
</style>