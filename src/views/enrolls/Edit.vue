<template>
  <el-dialog
      :title="dialogTitle"
      v-model="showDialog"
      width="80%"
      center
      @close="closeDialog(0)"
  >
    <el-form
        ref="formRef"
        :model="formInfo"
        class="edit"
        label-width="120px"
        :disabled="dialogTitle==='查看详情'"
    >
      <el-form-item label="SIP设备ID：" prop="deviceId" v-show="dialogTitle!=='添加设备'">
        <el-input :disabled="dialogTitle==='编辑设备'" v-model="formInfo.deviceId"></el-input>
      </el-form-item>
      <el-form-item label="信令服务器：" required>
        <!-- 第一行：选择按钮 -->
        <el-button
            v-if="dialogTitle === '添加设备'"
            type="primary"
            @click="showSipServerDialog = true"
            style="width: auto"
        >
          选择信令服务器
        </el-button>

        <div v-if="formInfo.domainId" class="sip-server-info">
          <div class="sip-row">
            <span><strong>SIP服务器ID：</strong>{{ formInfo.domainId }}</span>
            <span><strong>SIP服务器域：</strong>{{ formInfo.domain }}</span>
          </div>
          <div class="sip-row">
            <span><strong>SIP服务器地址：</strong>{{ formInfo.sipIp }}</span>
            <span><strong>SIP服务器端口：</strong>{{ formInfo.sipPort }}</span>
          </div>
        </div>
      </el-form-item>
      <el-row :gutter="20">
        <!-- 设备类型（支持二级） -->
        <el-col :span="12">
          <el-form-item label="设备类型：" prop="deviceTypeCode" required>
            <el-cascader
                v-model="formInfo.deviceTypeCode"
                :options="deviceTypes"
                :props="{
          checkStrictly: false,
          emitPath: false,
          value: 'id',
          label: 'name',
          children: 'subVos'
        }"
                placeholder="请选择设备类型"
                style="width: 100%"
                :disabled="dialogTitle !== '添加设备'"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="网络类型：" prop="networkTypeCode" required>
            <el-select
                v-model="formInfo.networkTypeCode"
                placeholder="请选择网络类型"
                filterable
                style="width: 100%"
                :disabled="dialogTitle !== '添加设备'"
            >
              <el-option
                  v-for="item in networkTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备名称：" prop="alias" required>
            <el-input v-model="formInfo.alias"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态：" prop="status" required v-show="dialogTitle!=='添加设备'">
            <el-switch
                v-model="formInfo.status"
                active-value="1"
                inactive-value="0"
                active-text="启用"
                inactive-text="停用"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="秘钥认证：" prop="pwdCheck" required>
            <el-switch v-model="formInfo.pwdCheck"
                       active-value="1"
                       inactive-value="0"
                       active-text="开启"
                       inactive-text="关闭"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="秘钥：" prop="pwd" v-show="formInfo.pwdCheck === '1'"
                        :required="formInfo.pwdCheck === '1'">
            <el-input v-model="formInfo.pwd"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="经度：" prop="longitude">
            <el-input v-model="formInfo.longitude"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="维度：" prop="latitude">
            <el-input v-model="formInfo.latitude"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="地址：" prop="address">
        <el-input v-model="formInfo.address"></el-input>
      </el-form-item>
      <el-form-item label="Tips：">
        <div class="sip-server-remark">
          <div><span><strong>1.传输方式：</strong>支持UDP/TCP；</span></div>
          <div><span><strong>2.协议版本：</strong>兼容GB28181-2022、GB28181-2016；</span></div>
          <div>
            <span><strong>3.建议：</strong>注册有效期大于等于3600秒，注册间隔等于60秒，心跳周期等于60秒，最大心跳超时次数等于3。</span>
          </div>
        </div>
      </el-form-item>

    </el-form>
    <template #footer>
      <div class="dialog-footer" style="right: auto">
        <el-button type="primary" @click="submitForm" v-show="dialogTitle!=='查看详情'">保存</el-button>
        <el-button @click="closeDialog" type="success">关闭</el-button>
      </div>
    </template>
    <!-- 放在 template 底部 -->
    <el-dialog
        v-model="showSipServerDialog"
        title="选择信令服务器"
        width="90%"
        append-to-body
    >
      <SessionServer :selectable="true" @select="handleSelectSipServer"/>
    </el-dialog>
  </el-dialog>
</template>
<script setup>
import {reactive, ref, watch} from "vue";
import {ElMessage} from "element-plus";
import enrollsApi from "@/api/enrolls.js";
import SessionServer from "@/views/enrolls/SessionServer.vue";
import domain from "@/api/domain.js";

const props = defineProps({
  dialogTitle: {
    type: String,
    default: "添加设备",
  },
  itemInfo: {
    type: Object,
    default: () => ({}),
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:modelValue", "closeDialog"]);

const formRef = ref(null);
const showDialog = ref(props.modelValue);

watch(
    () => props.modelValue,
    (newVal) => {
      showDialog.value = newVal;
    }
);

watch(
    () => showDialog.value,
    (newVal) => {
      emit("update:modelValue", newVal);
    }
);

const formInfo = reactive({
  deviceId: '',
  alias: '',
  longitude: '',
  latitude: '',
  address: '',
  status: '1',
  pwdCheck: '0',
  pwd: '',
  // 新增字段
  domainId: '',
  domain: '',
  sipIp: '',
  sipPort: '',
  deviceTypeCode: '',
  networkTypeCode: '',
});

watch(
    () => showDialog.value,
    async (newVal) => {
      emit("update:modelValue", newVal);

      if (newVal) {
        // 首次加载下拉选项（设备类型、网络类型）
        // if (!hasLoadedOptions) {
        //   await loadSelectOptions();
        //   hasLoadedOptions = true;
        // }

        // 如果是编辑或查看，需加载设备详情
        if (props.dialogTitle !== "添加设备") {
          const deviceId = props.itemInfo?.deviceId;
          if (deviceId) {
            try {
              let req = {
                'deviceId': deviceId,
              }
              const res = await domain.queryGbDomainDevice(req);
              if (res.data?.code === 200) {
                const detail = res.data.data || {};
                // 合并到 formInfo（保留 reactive 引用）
                Object.assign(formInfo, {
                  // 先重置为默认结构
                  deviceId: '',
                  alias: '',
                  longitude: '',
                  latitude: '',
                  address: '',
                  status: '1',
                  pwdCheck: '0',
                  pwd: '',
                  domainId: '',
                  domain: '',
                  sipIp: '',
                  sipPort: '',
                  deviceTypeCode: '',
                  networkTypeCode: '',
                  // 再覆盖真实数据
                  ...detail
                });
              } else {
                ElMessage.error("加载设备信息失败");
              }
            } catch (error) {
              console.error("查询设备详情失败", error);
              ElMessage.error("加载设备信息异常");
            }
          } else {
            ElMessage.warning("设备ID缺失，无法加载详情");
          }
        } else {
          // 添加设备：重置表单为初始状态
          Object.assign(formInfo, {
            deviceId: '',
            alias: '',
            longitude: '',
            latitude: '',
            address: '',
            status: '1',
            pwdCheck: '0',
            pwd: '',
            domainId: '',
            domain: '',
            sipIp: '',
            sipPort: '',
            deviceTypeCode: '',
            networkTypeCode: ''
          });
        }
      }
    }
);
const submitForm = () => {

  formRef.value.validate((valid) => {
    if (valid) {
      try {
        if (props.dialogTitle === "添加设备") {
          // 调用添加接口
          enrollsApi.add(formInfo).then((res) => {
            if (res.data.code === 200) {
              ElMessage({
                message: "添加成功！",
                type: "success",
              });
              closeDialog(1);
            }
          })
        } else if (props.dialogTitle === "编辑设备") {
          // 调用编辑接口
          enrollsApi.modify(formInfo).then((res) => {
            if (res.data.code === 200) {
              ElMessage({
                message: "编辑成功！",
                type: "success",
              });
              closeDialog(1);
            }
          })
        } else {
          return false;
        }
      } catch (error) {
        ElMessage({
          message: "操作失败！",
          type: "fail",
        });
      }
      // closeDialog(1);
    } else {
      return false;
    }
  });
};

const closeDialog = (flag) => {
  formRef.value.resetFields();
  showDialog.value = false;
  emit("closeDialog", flag);
};

const showSipServerDialog = ref(false);
// 处理选择
const handleSelectSipServer = (row) => {
  formInfo.domainId = row.domainId;
  formInfo.domain = row.domain;
  formInfo.sipIp = row.sipIp;
  formInfo.sipPort = row.sipPort;
  showSipServerDialog.value = false; // 关闭弹窗
  // 可选：提示
  // ElMessage.success(`已选择: ${row.domain}`);
};
const deviceTypes = ref([]);
const networkTypes = ref([]);
let hasLoadedOptions = false;

watch(
    () => showDialog.value,
    async (newVal) => {
      emit("update:modelValue", newVal);
      if (newVal && !hasLoadedOptions) {
        await loadSelectOptions();
        hasLoadedOptions = true;
      }
    }
);

const loadSelectOptions = async () => {
  try {
    const res = await domain.getGbNetworkDeviceTypeInfo();
    if (res.data?.code === 200) {
      deviceTypes.value = res.data.data.deviceTypes || [];
      networkTypes.value = res.data.data.networkTypes || [];
    }

  } catch (error) {
    console.error("加载下拉选项失败", error);
    ElMessage.error("加载选项失败，请重试");
  }
};

</script>

<style scoped>
@keyframes dialog-fade-in {
  0% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes dialog-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
}

/* 放在 <style scoped> 中 */
.sip-server-remark {
  width: 100%; /* ✅ 适应整个表单宽度 */
  padding: 14px;
  margin-top: 12px;
  background-color: #f9fafb;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  box-sizing: border-box; /* 确保 padding 不撑破宽度 */
}
.sip-server-info {
  width: 100%; /* ✅ 适应整个表单宽度 */
  padding: 14px;
  margin-top: 12px;
  background-color: #f9fafb;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  box-sizing: border-box; /* 确保 padding 不撑破宽度 */
}

.sip-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
  text-align: left;
}

.sip-row {
  display: flex;
  gap: 30px;
  font-size: 13px;
  color: #555;
  text-align: left;
}

.sip-row span {
  flex: 1;
  min-width: 180px;
  word-break: break-word;
}
</style>
