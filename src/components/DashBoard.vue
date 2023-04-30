<template>
  <el-container class="layout-container-demo">
    <el-aside width="200px">
      <!-- <el-image style="height:56px;"></el-image> -->
      <div style="height:60px;display: flex; align-items: center; justify-content: center;background-color: #409EFF;">CMS</div>

      <el-menu :default-openeds="['1','2', '3']">
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <message />
            </el-icon>我的面板
          </template>
          <el-menu-item-group>
            <el-menu-item index="1-1">未完成</el-menu-item>
            <el-menu-item index="1-2">已完成</el-menu-item>
          </el-menu-item-group>
          <!-- <el-menu-item-group title="审批单">
            <el-menu-item index="1-3">Option 3</el-menu-item>
          </el-menu-item-group>
          <el-sub-menu index="1-4">
            <template #title>Option4</template>
            <el-menu-item index="1-4-1">Option 4-1</el-menu-item>
          </el-sub-menu> -->
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><icon-menu /></el-icon>我的审批
          </template>
          <el-menu-item-group>
            <!-- <template #title>Group 1</template> -->
            <el-menu-item index="2-1">请假申请</el-menu-item>
            <el-menu-item index="2-2">人事申请</el-menu-item>
          </el-menu-item-group>
          <!-- <el-menu-item-group title="Group 2">
            <el-menu-item index="2-3">Option 3</el-menu-item>
          </el-menu-item-group>
          <el-sub-menu index="2-4">
            <template #title>Option 4</template>
            <el-menu-item index="2-4-1">Option 4-1</el-menu-item>
          </el-sub-menu> -->
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <el-icon>
              <setting />
            </el-icon>我的信息
          </template>
          <el-menu-item-group>
            <el-menu-item index="3-1">账号信息</el-menu-item>
            <el-menu-item index="3-2">个人信息</el-menu-item>
          </el-menu-item-group>
        
        </el-sub-menu>
      </el-menu>

    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <el-dropdown>
            <el-icon style="margin-right: 8px; margin-top: 1px">
              <setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>View</el-dropdown-item>
                <el-dropdown-item>Add</el-dropdown-item>
                <el-dropdown-item>Delete</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>Tom</span>
        </div>
      </el-header>

      <el-main>
        <el-scrollbar>
          <el-table :data="tableData">
            <el-table-column prop="date" label="日期" width="140" />
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="task" label="任务" width="120"/>
            <el-table-column label="操作" min-width="120">
              <el-button size="small" type="success">提交</el-button>
              <el-button size="small" type="danger" >放弃</el-button>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </el-main>
      <el-footer style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <el-dropdown>
            <el-icon style="margin-right: 8px; margin-top: 1px">
              <setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>View</el-dropdown-item>
                <el-dropdown-item>Add</el-dropdown-item>
                <el-dropdown-item>Delete</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>Tom</span>
        </div>
      </el-footer>
    </el-container>
  </el-container>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'
import { ElFooter } from 'element-plus';

const item = {
  date: '2023-05-01',
  name: '张三',
  task: '完成销售任务',
}
const tableData = ref(Array.from({ length: 12 }).fill(item))
</script>

  
<style scoped>
.layout-container-demo .el-header {
  position: relative;
  /* background-color: var(--el-color-primary-light-7); */
  color: var(--el-text-color-primary);
}

.layout-container-demo .el-footer {
  position: relative;
  /* background-color: var(--el-color-primary-light-7); */
  color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  /* background: var(--el-color-primary-light-8); */
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 0;
}

.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>