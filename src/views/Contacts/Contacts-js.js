import Services from '@/services/Services';
const columns = [{
  title: 'Type',
  dataIndex: 'type',
  sorter: true,
  width:200,
  fixed: 'left',
  scopedSlots: { customRender: 'type' },
},
{
  title: 'Name',
  dataIndex: 'name',
  sorter: true,
  width:200,
  fixed: 'left',
  scopedSlots: { customRender: 'name' },

},
{
  title: 'Title',
  dataIndex: 'title',
  width:200,
  scopedSlots: { customRender: 'titlex' },

},
{
  title: 'Phone',
  dataIndex: 'phone',
  width:200,
  scopedSlots: { customRender: 'phone' },

},
{
  title: 'Fax',
  dataIndex: 'fax',
  width:200,
  scopedSlots: { customRender: 'fax' },

},
{
  title: 'Email',
  dataIndex: 'email',
  width:200,
  scopedSlots: { customRender: 'email' },
}, 
{
  title: 'operation',
  dataIndex: 'operation',
  width:200,
  fixed: 'right',
  scopedSlots: { customRender: 'operation' },
}
];

export default {
  name: 'Contacts',
  created() {
    this.fetch();
  },
  data() {
    return {
      cacheData:[],
      data: [],
      // cacheData : data.map(item => ({ ...item })),
      // data,
      pagination: {pageSize:10,current:1},
      loading: false,
      columns,
      deleting_contact :false,
      visible:false,
      saving_contact :false,
      search_key: '',
      show_modal: false,
      saving_contact: false,
      editable: false,
      payload: {
        type: null,
        name: null,
        title: null,
        phone: null,
        fax: null,
        email: null,
      },
      errors: {},
    };
  },
  methods: {
    showDrawer() {
      this.visible = true
    },
    onClose() {
      this.visible = false
    },
    handleChange (value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item._id)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    edit (key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item._id)[0]
      if (target) {
        target.editable = true
        this.data = newData
      }
    },
    onDelete (id){
      var that = this;
      this.deleting_contact = true;
      this.$Services.api.delete({
        resource: this.$Services.api + id,
        params:{id}
      }).then(
        () => {
          setTimeout(() => {
            
          }, 2000);
          that.deleting_contact = false;
          that.$Services.noty.success('Deleted product Successfully');
          that.fetch()
        },
        (error) => {
          that.deleting_contact = false;
          that.$Services.noty.error('Something went wrong');
        },
      );
    },
    save (key) {
      const newData = [...this.data]
      const contact = newData.filter(item => key === item._id)[0]
      if (contact) {
        this.saving_contact = true;
        this.$Services.api.update({
            resource:this.$Services.api.api+contact._id,
            data: contact
          }).then(
            () => {
              this.saving_contact = false;
              setTimeout(() => {
              }, 2000);
              this.$Services.noty.success('Contact updated Successfully');
              this.fetch()
            },
            (error) => {
              this.saving_contact = false;
              if (error.response.status === 400) {
                this.$Services.noty.error(error.response.data);
              } else {
                this.$Services.noty.error('Something went wrong');
              }
            },
          );
      }
    },
    cancel (key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item._id)[0]
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item._id)[0])
        delete target.editable
        this.data = newData
      }
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination
      };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch({
        page_size: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    },
    fetch(params = {}) {
      this.loading = true
      Services.api.list({
        resource: this.$Services.api.api,
        page_size: params.page_size || this.pagination.pageSize,
        page: params.page || this.pagination.current,
        params: params
      }).then((data) => {
        const pagination = { ...this.pagination};
        // Read total count from server
        // pagination.total = data.totalCount;
        pagination.total = data.data.totalDocs;
        pagination.pageSize = data.data.limit;
        this.loading = false;

        this.data = data.data.docs;
        this.cacheData = this.data.map(item => ({ ...item }))

        this.pagination = pagination;
      });
    },
    createContact() {
      const that = this;
      that.saving_contact = true;
      if (that.validate()) {
        that.$Services.api.create({data:that.payload}).then(
          () => {
            that.saving_contact = false;
            that.$Services.noty.success('Contact Added Successfully');
            that.onClose()
            that.fetch()
          },
          (error) => {
            that.saving_contact = false;
            if (error.response.status === 400) {
              that.$Services.noty.error(error.response.data);
            } else {
              that.$Services.noty.error('Something went wrong');
            }
          },
        );
      } else {
        that.saving_contact = false;
      }
    },
    close_modal() {
      this.show_modal = false;
    },
    validate() {
      let proceed = true;
      const that = this;
      that.errors = {};
      // eslint-disable-next-line
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      
      if (that.payload.type === '' || that.payload.type === null) {
        proceed = false;
        that.errors.type = 'Type feild is required';
      }
      if (that.payload.name === '' || that.payload.name === null) {
        proceed = false;
        that.errors.name = 'Name feild is required';
      }
      if (that.payload.title === '' || that.payload.title === null) {
        proceed = false;
        that.errors.title = 'Title feild is required';
      }
      if (that.payload.phone === '' || that.payload.phone === null) {
        proceed = false;
        that.errors.phone = 'Phone feild is required';
      }
      if (that.payload.fax === '' || that.payload.fax === null) {
        proceed = false;
        that.errors.fax = 'Fax feild is required';
      }
      if (that.payload.email === '' || that.payload.email === null) {
        proceed = false;
        that.errors.email = 'Email feild is required';
      } else if (!re.test(String(this.payload.email).toLowerCase())) {
        proceed = false;
        this.errors.email = 'Invalid Email address';
      }
      return proceed;
    },
    resetForm() {
      this.payload = {
        type: null,
        name: null,
        title: null,
        phone: null,
        fax: null,
        email: null,
      };
    },
  },
};
