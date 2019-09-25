<template>
  <nav>
    <ul class="pagination mb-0">
      <li class="page-item" :class="{ disabled: !pagination.has_pre }">
        <a
          class="page-link"
          href="#"
          aria-label="Previous"
          @click.prevent="getPage(pagination.current_page - 1)"
        >
          <span aria-hidden="true">&laquo;</span>
          <span class="sr-only">Previous</span>
        </a>
      </li>

      <li
        class="page-item"
        v-for="page in pagination.total_pages"
        :key="page"
        :class="{ active: page === pagination.current_page }"
      >
        <a class="page-link" href="#" @click.prevent="getPage(page)">{{ page }}</a>
      </li>

      <li class="page-item" :class="{ disabled: !pagination.has_next }">
        <a
          class="page-link"
          href="#"
          aria-label="Next"
          @click.prevent="getPage(pagination.current_page + 1)"
        >
          <span aria-hidden="true">&raquo;</span>
          <span class="sr-only">Next</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  // pagination 不一定要使用到 vuex，因為其接收的資料會依各個元件而有所不同 (每個 pagination 皆獨立)，
  // 維持獨立狀態可在同個元件中使用到多個 pagination (不一定會這麼做，但可沿用獨立元件的概念)
  // 如果 pagination 使用 vuex 的話，每頁的預設 pagination 會錯亂
  props: ['pagination'],
  methods: {
    // 先透過 vuex products 取得分頁 data，再透過 getPage 來取得點擊的分頁
    getPage(page) {
      // 點擊的頁數與目前頁數相同時，不要觸發點擊事件
      if (page === this.pagination.current_page) return;
      // 觸發元件所綁定的自定義事件，並傳遞參數
      this.$emit('getPage', page);
    },
  },
};
</script>

<style></style>
