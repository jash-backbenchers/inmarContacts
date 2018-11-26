<template>
  <div class="Contacts">
    <div class="content">
      <a-row :gutter="10" type="flex" justify="space-between">
        <a-col :span="8">
          <!-- <h5>Contacts</h5> -->
        </a-col>
        <a-col>
          <!-- <a-button shape="circle" v-on:click="$router.push('/contacts/create/')" icon="plus" /> -->
          <a-button shape="circle" @click="showDrawer" icon="plus" />
        </a-col>
      </a-row>
      <br>
      <a-table :columns="columns" :dataSource="data" bordered :scroll="{ x: 1400}" :pagination="pagination" :loading="loading"
        :rowKey="record => record._id" @change="handleTableChange">
        <template v-for="col in ['type', 'name', 'titlex', 'phone', 'fax', 'email']" :slot="col" slot-scope="text, record, index">
          <div>
            <a-input v-if="record.editable" style="margin: -5px 0" :value="text" @change="e => handleChange(e.target.value, record._id, col)" />
            <template v-else>{{text}}</template>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <div class='editable-row-operations'>
            <span v-if="record.editable">
              <a style="margin-right:8px" @click="() => save(record._id)">Save</a>
              <a-popconfirm title='Sure to cancel?' @confirm="() => cancel(record._id)">
                <a>Cancel</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a style="margin-right:8px" @click="() => edit(record._id)">Edit</a>
              <a-popconfirm title="Sure to delete?" @confirm="() => onDelete(record._id)">
                <a href="javascript:;">Delete</a>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </a-table>
      <a-drawer
      title="Create"
      width=720
      placement="right"
      :closable="false"
      @close="onClose"
      :visible="visible"
      style="height: calc(100% - 55px);overflow: 'auto';paddingBottom: 53px"
    >
      <a-form layout="vertical" hideRequiredMark>
        <a-row :gutter="16">
          <a-col :span="12">
                <a-form-item label='Type'  fieldDecoratorId="type"
                  :fieldDecoratorOptions="{rules: [{ required: true, message: 'Please enter Type!' }]}">
                  <a-input v-model="payload.type" />
                </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label='Name' fieldDecoratorId="name"
                  :fieldDecoratorOptions="{rules: [{ required: true, message: 'Please enter Name!' }]}">
                  <a-input v-model="payload.name" />
                </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label='title' fieldDecoratorId="title"
                  :fieldDecoratorOptions="{rules: [{ required: true, message: 'Please enter title!' }]}">
                  <a-input v-model="payload.title" />
                </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label='phone' fieldDecoratorId="phone"
                  :fieldDecoratorOptions="{rules: [{ required: true, message: 'Please enter phone!' }]}">
                  <a-input v-model="payload.phone" />
                </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label='fax' fieldDecoratorId="fax"
                  :fieldDecoratorOptions="{rules: [{ required: true, message: 'Please enter fax!' }]}">
                  <a-input v-model="payload.fax" />
                </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label='Email' fieldDecoratorId="email"
                  :fieldDecoratorOptions="{rules: [{ required: true, message: 'Please enter Email!' }]}">
                  <a-input v-model="payload.email" />
                </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px',
        }"
      >
        <a-button
          :style="{
            marginRight: 8,
          }"
          @click="onClose"
        >
          Cancel
        </a-button>
        <a-button @click="createContact" :loading="saving_contact" type="primary">Submit</a-button>
      </div>
    </a-drawer>
    </div>
  </div>
</template>

<script src="./Contacts-js.js"></script>
<style src="./Contacts-style.styl" lang="stylus" scoped></style>