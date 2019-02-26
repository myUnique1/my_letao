$(function(){

    // 1. 一进入页面,发送ajax请求获取数据,渲染页面
    var currentPage = 1;
    var pageSize = 3;
    var picArr = [];
    render();

    function render(){
        $.ajax({
            type: 'get',
            url: '/product/queryProductDetailList',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function(info){
                console.log(info);
                var htmlstr = template('productTpl',info);
                $('tbody').html(htmlstr);

                // 渲染分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,//指定bootstrap的版本，如果是3，必须指定
                    currentPage: info.page,//指定当前页
                    totalPages: Math.ceil(info.total / info.size),//指定总页数
                    onPageClicked: function (a, b, c, page) {
                        //page指的是点击的页码,修改了当前页
                        currentPage = page;
                        //重新渲染
                        render();
                    }
                });
                
            }
        })
    };

    // 2. 点击添加商品按钮,展示模态框
    $('#addBtn').on('click', function(){
        $('#addModal').modal('show');

        // 2.1 发送ajax 请求,获取二级分类数据,渲染到ul里
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: 'json',
            success: function(info){
                console.log(info);
                var htmlstr = template('dropdownTpl',info);
                $('.dropdown-menu').html(htmlstr);
                
            }
        })
   
       
    });

    // 3. 给下拉菜单下面的 a 添加点击事件 (事件委托)
    $('.dropdown-menu').on('click', 'a',function(){
        var txt = $(this).text();
        $('#dropdownText').text(txt);

        var id = $(this).data('id');
        $('[name="brandId"]').val(id);

        $('#form').data('bootstrapValidator').updateStatus('brandId','VALID');
    })


    // 4.进行文件上传初始化
    $("#fileupload").fileupload({
        dataType: "json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {
            // console.log(data);
            var picObj = data.result;
            var picUrl = picObj.picAddr;

            picArr.unshift(picObj);
            $('#imgBox').prepend('<img style="height: 100px;" src="' + picUrl +'" alt="">');

            if(picArr.length > 3){
                picArr.pop();
                $('#imgBox img:last-of-type').remove();
            }

            if(picArr.length === 3){
                $('#form').data('bootstrapValidator').updateStatus('picStatus','VALID');
            }
        }
    });


    // 5. 添加表单校验功能
    //使用表单校验插件
    $('#form').bootstrapValidator({
        //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        excluded: [],

        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //3. 指定校验字段
        fields: {
            //校验用户名，对应name表单的name属性
            brandId: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请选择二级分类'
                    }               
                }
            },
            proName: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入商品名称'
                    }
                }
            },
            proDesc: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入商品描述'
                    }
                }
            },
            num: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入商品库存'
                    },
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存必须是非零开头的数字'
                    }
                }
            },
            size: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入商品尺码'
                    },
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '尺码格式, 必须是 xx-xx 格式,  xx 是两位数字, 例如: 32-40'
                    }

                }
            },
            oldPrice: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入商品原价'
                    }
                }
            },
            price: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入商品现价'
                    }
                }
            },
            picStatus: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请上传三张图片'
                    }
                }
            },
        }

    });


    // 6. 注册表单校验成功事件,阻止默认的提交,通过ajax提交
    $('#form').on('success.form.bv',function(e){
        e.preventDefault();

        var paramsStr = $('#form').serialize();

        paramsStr += '&picArr=' + JSON.stringify(picArr);

        $.ajax({
            type: 'post',
            url: '/product/addProduct',
            data: paramsStr,
            dataType: 'json',
            success: function(info){
                console.log(info);
                if(info.success){
                    $('#addModal').modal('hide');
                    currentPage = 1;
                    render();

                    $('#form').data('bootstrapValidator').resetForm(true);

                    $('#dropdownText').text('请选择二级分类');
                    $('#imgBox img').remove();
                    picArr = [];
                }
                
            }
        })
    })

   
})