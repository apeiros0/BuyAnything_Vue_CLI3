<template>
  <section>
    <loading :active.sync="isLoading"></loading>
    <div class="mt-4 d-flex justify-content-between align-items-center">
      <button class="btn btn-primary btn-lg" @click="openModal(true)">
        新增優惠券
      </button>
      <Pagination :pagination="pagination" @getPage="getCoupons"></Pagination>
    </div>
    <div class="table-responsive mt-5">
      <table class="table mt-4">
        <thead>
          <tr>
            <th>名稱</th>
            <th width="120" class="white-space-nowrap">折扣百分比</th>
            <th width="120">到期日</th>
            <th width="100" class="white-space-nowrap">是否啟用</th>
            <th width="120">編輯</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in formatData" :key="item.id">
            <td class="white-space-nowrap">{{ item.title }}</td>
            <td>{{ item.percent }}%</td>
            <td>
              <span v-if="item.is_enabled === 1">{{
                item.due_date | timeFormat
              }}</span>
              <span v-else></span>
            </td>
            <td class="white-space-nowrap">
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
                  data-target="#couponModal"
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
      id="couponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span v-if="isNew">新增優惠券</span>
              <span v-else>編輯優惠券</span>
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
            <form>
              <div class="form-group">
                <label for="inputTitle">標題</label>
                <input
                  type="text"
                  class="form-control"
                  id="inputTitle"
                  aria-describedby="emailHelp"
                  placeholder="請輸入標題"
                  v-model="tempCoupon.title"
                />
              </div>
              <div class="form-group">
                <label for="inputCoupon">優惠碼</label>
                <input
                  type="text"
                  class="form-control"
                  id="inputCoupon"
                  placeholder="請輸入優惠碼"
                  v-model="tempCoupon.code"
                />
              </div>
              <div class="form-group">
                <label for="inputPercent">折扣百分比</label>
                <input
                  type="number"
                  class="form-control"
                  id="exampleInputPassword1"
                  placeholder="請輸入折扣百分比"
                  v-model.number="tempCoupon.percent"
                />
              </div>
              <div class="form-group">
                <label for="inputDueDate">到期日</label>
                <!-- date 的資料格式要 YY-MM-DD 才能綁定 (月分和日期皆需要兩位數: 01、02...) -->
                <input
                  type="date"
                  class="form-control"
                  id="exampleInputPassword1"
                  placeholder="請輸入到期日"
                  v-model="tempCoupon.due_date"
                  :disabled="tempCoupon.is_enabled !== 1"
                />
                <div class="form-group form-check mt-2 ml-1">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="is_enabled"
                    v-model="tempCoupon.is_enabled"
                    :true-value="1"
                    :false-value="0"
                  />
                  <label class="form-check-label" for="is_enabled"
                    >是否啟用</label
                  >
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              data-dismiss="modal"
            >
              取消
            </button>
            <button type="button" class="btn btn-primary" @click="updateCoupon">
              確認
              <i class="fas fa-spinner fa-pulse" v-if="status.editLoading"></i>
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
              刪除 {{ tempCoupon.title }}
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
          <div class="modal-body">是否要刪除 {{ tempCoupon.title }} ?</div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              取消
            </button>
            <button type="button" class="btn btn-danger" @click="deleteCoupon">
              確認
              <i
                class="fas fa-spinner fa-pulse"
                v-if="status.deleteLoading"
              ></i>
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
      coupons: [],
      tempCoupon: {},
      pagination: {},
      isNew: false,
      isLoading: false,
      status: {
        editLoading: false,
        deleteLoading: false,
      },
      page: 1,
    };
  },
  created() {
    this.getCoupons();
  },
  methods: {
    getCoupons(page = 1) {
      this.page = page;
      const api = `${process.env.VUE_APP_API_URL}/api/${process.env.VUE_APP_API_PATH}/admin/coupons?page=${page}`;
      const self = this;
      self.isLoading = true;
      self.$http.get(api).then((response) => {
        self.coupons = response.data.coupons;
        self.isLoading = false;
        self.pagination = response.data.pagination;
      });
    },
    openModal(isNew, item, isDelete = false) {
      if (isNew) {
        this.tempCoupon = {};
        this.isNew = true;
      } else {
        /* assign 是避免 by reference (避免參照到同一個 item) */
        this.tempCoupon = Object.assign({}, item);
        this.isNew = false;
      }
      if (isDelete) {
        $('#deleteModal').modal('show');
      } else {
        $('#couponModal').modal('show');
      }
    },
    updateCoupon() {
      // 新增優惠券
      let api = `${process.env.VUE_APP_API_URL}/api/${process.env.VUE_APP_API_PATH}/admin/coupon`;
      let APIMethod = 'post';
      const self = this;
      // 把 到期日 轉換成 timeStamp
      const formatTimeStamp = Math.floor(
        new Date(self.tempCoupon.due_date) / 1000,
      );
      // 現在日期 的 timeStamp
      const formatNowTime = Math.floor(
        new Date(self.formatDate(Date.now())) / 1000 / 1000,
      );
      // 要送出的參數
      let newObject = { ...self.tempCoupon };
      newObject.due_date = formatTimeStamp || formatNowTime; // 沒有填 到期日 就帶入當日的日期
      // loading 效果
      self.status.editLoading = true;
      // 編輯優惠券
      if (!self.isNew) {
        api = `${process.env.VUE_APP_API_URL}/api/${process.env.VUE_APP_API_PATH}/admin/coupon/${self.tempCoupon.id}`;
        APIMethod = 'put';
        newObject = {
          title: self.tempCoupon.title,
          is_enabled: self.tempCoupon.is_enabled,
          percent: self.tempCoupon.percent,
          due_date: formatTimeStamp || formatNowTime,
          code: self.tempCoupon.code,
        };
      }
      self.$http[APIMethod](api, { data: newObject }).then((response) => {
        if (response.data.success) {
          $('#couponModal').modal('hide');
          self.getCoupons(self.page);
          self.$store.dispatch('updateMessage', {
            message: response.data.message,
            status: 'success',
          });
        } else {
          $('#couponModal').modal('hide');
          self.getCoupons(self.page);
          self.$store.dispatch('updateMessage', {
            message: '更新失敗',
            status: 'danger',
          });
        }
        self.status.editLoading = false;
      });
    },
    deleteCoupon() {
      const self = this;
      const api = `${process.env.VUE_APP_API_URL}/api/${process.env.VUE_APP_API_PATH}/admin/coupon/${self.tempCoupon.id}`;
      self.status.deleteLoading = true;
      self.$http.delete(api).then((response) => {
        if (response.data.success) {
          $('#deleteModal').modal('hide');
          self.getCoupons(self.page);
          self.$store.dispatch('updateMessage', {
            message: response.data.message,
            status: 'danger',
          });
          self.status.deleteLoading = false;
        }
      });
    },
    // timeStamp 轉換成日期
    formatDate(time) {
      const date = new Date(time * 1000);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const formatMonth = month < 10 ? `0${month}` : month;
      const formatDay = day < 10 ? `0${day}` : day;
      return `${year}-${formatMonth}-${formatDay}`;
    },
  },
  computed: {
    // 重組資料，讓畫面顯示
    formatData() {
      const self = this;
      const tempArray = [];
      // 轉換日期格式: YY/MM/DD (需兩位數)
      self.coupons.forEach((item) => {
        tempArray.push({
          title: item.title,
          is_enabled: item.is_enabled,
          percent: item.percent,
          due_date: this.formatDate(item.due_date),
          num: item.num,
          id: item.id,
          code: item.code,
        });
      });
      return tempArray;
    },
  },
  components: {
    Pagination,
  },
};
</script>

<style></style>
