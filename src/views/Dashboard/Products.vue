<template>
  <section>
    <loading :active.sync="isLoading"></loading>
    <div class="mt-4 d-flex justify-content-between align-items-center">
      <button class="btn btn-primary btn-lg" @click="openModal(true)">
        建立新產品
      </button>
      <Pagination :pagination="pagination" @getPage="getProducts"></Pagination>
    </div>
    <div class="table-responsive mt-3">
      <table class="table">
        <thead>
          <tr>
            <th width="120">分類</th>
            <th>產品名稱</th>
            <th width="120" class="text-right">原價</th>
            <th width="120" class="text-right">售價</th>
            <th width="100" class="white-space-nowrap">是否啟用</th>
            <th width="120">編輯</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products" :key="item.id">
            <td class="white-space-nowrap">{{ item.category }}</td>
            <td class="white-space-nowrap">{{ item.title }}</td>
            <td class="text-right">{{ item.origin_price | currency }}</td>
            <td class="text-right">{{ item.price | currency }}</td>
            <td>
              <!-- 產品啟用 === 1 -->
              <span v-if="item.is_enabled === 1" class="text-success"
                >啟用</span
              >
              <span v-else class="text-danger">未啟用</span>
            </td>
            <td class="white-space-nowrap">
              <div class="btn-group" role="group" aria-label="Basic example">
                <button
                  class="btn btn-outline-primary btn-sm"
                  data-toggle="modal"
                  data-target="#editModal"
                  @click="openModal(false, item)"
                >
                  編輯
                </button>
                <button
                  class="btn btn-danger btn-sm"
                  data-toggle="modal"
                  data-target="#deleteModal"
                  @click="openModal(false, item, true)"
                >
                  刪除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Add & Edit Modal -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span v-if="isNew">新增產品</span>
              <span v-else>編輯產品</span>
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input
                    type="text"
                    class="form-control"
                    id="image"
                    placeholder="請輸入圖片連結"
                    v-model="tempProduct.imageUrl"
                  />
                </div>
                <div class="form-group">
                  <label for="customFile">
                    或 上傳圖片
                    <i
                      class="fas fa-spinner fa-pulse"
                      v-if="status.fileUpLoading"
                    ></i>
                  </label>
                  <input
                    type="file"
                    id="customFile"
                    class="form-control"
                    ref="files"
                    @change="uploadFile"
                  />
                </div>
                <img class="img-fluid" alt :src="tempProduct.imageUrl" />
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    placeholder="請輸入標題"
                    v-model="tempProduct.title"
                  />
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input
                      type="text"
                      class="form-control"
                      id="category"
                      placeholder="請輸入分類"
                      v-model="tempProduct.category"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input
                      type="unit"
                      class="form-control"
                      id="unit"
                      placeholder="請輸入單位"
                      v-model.number="tempProduct.unit"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="origin_price">原價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="origin_price"
                      placeholder="請輸入原價"
                      v-model.number="tempProduct.origin_price"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="price"
                      placeholder="請輸入售價"
                      v-model.number="tempProduct.price"
                    />
                  </div>
                </div>
                <hr />

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="description"
                    placeholder="請輸入產品描述"
                    v-model="tempProduct.description"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="content"
                    placeholder="請輸入產品說明內容"
                    v-model="tempProduct.content"
                  ></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="is_enabled"
                      v-model.number="tempProduct.is_enabled"
                      :true-value="1"
                      :false-value="0"
                    />
                    <label class="form-check-label" for="is_enabled"
                      >是否啟用</label
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              data-dismiss="modal"
            >
              取消
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="updateProduct"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Delete Modal -->
    <div
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              刪除 {{ tempProduct.title }}
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">是否要刪除 {{ tempProduct.title }} ?</div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              取消
            </button>
            <button type="button" class="btn btn-danger" @click="deleteProduct">
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import $ from 'jquery';
import Pagination from '@/components/Pagination.vue';

export default {
  data() {
    return {
      products: [],
      tempProduct: {},
      pagination: {},
      isNew: false,
      isLoading: false,
      status: {
        fileUpLoading: false,
      },
      page: 1,
    };
  },
  created() {
    this.getProducts();
  },
  methods: {
    getProducts(page = 1) {
      this.page = page;
      const api = `${process.env.VUE_APP_API_URL}/api/${process.env.VUE_APP_API_PATH}/admin/products?page=${page}`;
      const self = this;
      self.isLoading = true;
      this.$http.get(api).then((response) => {
        self.products = response.data.products;
        // console.log('products', self.products);
        self.isLoading = false;
        self.pagination = response.data.pagination;
      });
    },
    openModal(isNew, item, isDelete = false) {
      if (isNew) {
        this.tempProduct = {};
        // 判斷是否為新的產品 (更新產品用)
        this.isNew = true;
      } else {
        // assign 是避免 by reference (避免參照到同一個 item)
        // 透過 temp 一次紀錄一筆資料
        this.tempProduct = Object.assign({}, item);
        this.isNew = false;
      }

      if (isDelete) {
        $('#deleteModal').modal('show');
      } else {
        $('#productModal').modal('show');
      }
    },
    updateProduct() {
      let api = `${process.env.VUE_APP_API_URL}/api/${process.env.VUE_APP_API_PATH}/admin/product`;
      let APIMethod = 'post';
      const self = this;
      if (!self.isNew) {
        api = `${process.env.VUE_APP_API_URL}/api/${process.env.VUE_APP_API_PATH}/admin/product/${self.tempProduct.id}`;
        APIMethod = 'put';
      }
      // product 的第一個 post 行為，要代入 tempProduct 參數
      // $http[APIMethod] 使用 object[property]] 的方式決定 API method
      this.$http[APIMethod](api, { data: self.tempProduct }).then(
        (response) => {
          if (response.data.success) {
            // 建立完產品資料後，關閉 Modal，並重新取得產品資料
            $('#productModal').modal('hide');
            self.getProducts(self.page);
            self.$store.dispatch('updateMessage', {
              message: response.data.message,
              status: 'success',
            });
          } else {
            $('#productModal').modal('hide');
            self.getProducts(self.page);
            self.$store.dispatch('updateMessage', {
              message: '更新失敗',
              status: 'danger',
            });
          }
        },
      );
    },
    deleteProduct() {
      const api = `${process.env.VUE_APP_API_URL}/api/${process.env.VUE_APP_API_PATH}/admin/product/${this.tempProduct.id}`;
      const self = this;
      this.$http.delete(api).then((response) => {
        if (response.data.success) {
          // 刪除產品資料後，關閉 Modal，並重新取得產品資料 */
          $('#deleteModal').modal('hide');
          self.getProducts(this.page);
          self.$store.dispatch('updateMessage', {
            message: response.data.message,
            status: 'danger',
          });
        } else {
          // 刪除失敗顯示訊息
          $('#deleteModal').modal('hide');
          self.getProducts(self.page);
          self.$store.dispatch('updateMessage', {
            message: response.data.message,
            status: 'danger',
          });
        }
      });
    },
    uploadFile() {
      // 定義已經上傳的檔案
      // 透過 ref 取得 input file 上傳的檔案
      const uploadedFile = this.$refs.files.files[0];
      const self = this;
      // formData 能透過 ajax 方式傳送表單資料
      const formData = new FormData();
      formData.append('file-to-upload', uploadedFile);
      const api = `${process.env.VUE_APP_API_URL}/api/${process.env.VUE_APP_API_PATH}/admin/upload`;
      self.status.fileUpLoading = true;
      this.$http.post(api, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((response) => {
        if (response.data.success) {
          // 由於 data 沒有綁定 imageUrl，所以傳送回來的 url 是無法加入到 Vue 的 data 監控
          // self.tempProduct.imageUrl = response.data.imageUrl
          // 透過 $set 重新加入到 Vue 的 data 監控
          self.$set(self.tempProduct, 'imageUrl', response.data.imageUrl);
          self.status.fileUpLoading = false;
          // 上傳成功後，清空 input file
          $('#customFile').val('');
        } else {
          let errorMessage = response.data.message;
          if (typeof response.data.message === 'object') {
            errorMessage = response.data.message.message;
          }
          self.$store.dispatch('updateMessage', {
            message: errorMessage,
            status: 'danger',
          });
          self.status.fileUpLoading = false;
        }
      });
    },
  },
  components: {
    Pagination,
  },
};
</script>

<style></style>
