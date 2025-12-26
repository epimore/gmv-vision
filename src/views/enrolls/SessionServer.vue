<template>
  <div class="session-server-container">
    <!-- 搜索区域 -->
    <div class="search-bar">
      <el-input
          v-model="searchForm.areaName"
          clearable
          placeholder="请输入区域名称"
          @clear="handleSearch"
          class="search-item"
      >
        <template #prepend>区域名称</template>
      </el-input>

      <el-input
          v-model="searchForm.industryName"
          clearable
          placeholder="请输入行业名称"
          @clear="handleSearch"
          class="search-item"
      >
        <template #prepend>行业名称</template>
      </el-input>

      <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>

    <!-- 表格 -->
    <el-table
        :data="tableData"
        border
        style="width: 100%"
        :cell-style="{ textAlign: 'center', padding: '12px 8px' }"
        :header-cell-style="{
        textAlign: 'center',
        background: '#f8f9fa',
        color: '#333',
        fontWeight: 'bold',
        padding: '14px 8px'
      }"
    >
      <el-table-column label="序号" type="index" width="70" />
      <el-table-column prop="domainId" label="sip服务器域ID" min-width="220" show-overflow-tooltip />
      <el-table-column prop="domain" label="sip服务器域" min-width="120" />
      <el-table-column prop="sipIp" label="sip服务器地址" min-width="135" />
      <el-table-column prop="sipPort" label="sip服务器端口" min-width="135" />
      <el-table-column prop="areaName" label="区域" min-width="140" />
      <el-table-column prop="industryName" label="行业" min-width="180" />
      <el-table-column prop="status" label="启用状态" min-width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
            {{ scope.row.status === 1 ? "启用" : "停用" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="online" label="在线状态" min-width="100">
        <template #default="scope">
          <el-tag :type="scope.row.online === 1 ? 'success' : 'danger'">
            {{ scope.row.online === 1 ? "在线" : "离线" }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 选择操作列 -->
      <el-table-column label="操作" min-width="100" v-if="selectable">
        <template #default="scope">
          <el-button type="seriously" size="small" @click="handleSelect(scope.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-wrapper" v-if="total > 0">
      <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          :current-page="pageNum"
          @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import domain from "@/api/domain.js";
import { Search } from "@element-plus/icons-vue";

const props = defineProps({
  selectable: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["select"]);

// 分页
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0);
const tableData = ref([]);

// 搜索表单（注意：初始值必须与后端分页参数一致）
const searchForm = reactive({
  areaName: "",
  industryName: "",
  pageNum: 1,
  pageSize: 10,
});

// 获取数据
const getSessionServerList = async () => {
  try {
    const res = await domain.queryGbServerInfos(searchForm);
    if (res.data?.code === 200) {
      total.value = res.data.data.total || 0;
      tableData.value = res.data.data.list || [];
    } else {
      ElMessage.warning(res.data?.msg || "获取失败");
    }
  } catch (error) {
    ElMessage.error("获取信令服务器列表失败");
  }
};

// 搜索
const handleSearch = () => {
  searchForm.pageNum = 1; // 重置到第一页
  pageNum.value = 1;
  getSessionServerList();
};

// 重置
const handleReset = () => {
  searchForm.areaName = "";
  searchForm.industryName = "";
  searchForm.pageNum = 1;
  pageNum.value = 1;
  getSessionServerList(); // 重新加载全部数据
};

// 分页切换
const handlePageChange = (newPage) => {
  pageNum.value = newPage;
  searchForm.pageNum = newPage;
  getSessionServerList();
};

// 选择回调
const handleSelect = (row) => {
  emit("select", row);
};

onMounted(() => {
  getSessionServerList();
});
</script>

<style scoped>
.session-server-container {
  padding: 20px;
  width: 100%;
  max-width: none;
  /* ✅ 设置最低高度，防止内容少时页面太短 */
  min-height: 600px; /* 可根据需求调整：500px / 600px / 70vh 等 */
  display: flex;
  flex-direction: column;
}

.search-bar {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.search-item {
  width: 280px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 大屏优化 */
@media (min-width: 1600px) {
  .search-item {
    width: 320px;
  }
}
</style>