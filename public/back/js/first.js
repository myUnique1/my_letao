$(function(){

    // 1. 一进入页面,动态渲染页面
    var currentPage = 1;
    var pageSize = 5;
    render();
    function render(){
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                var htmlstr = template('firstTbl', info);
                $('tbody').html(htmlstr);
               

                //渲染分页
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
    }


    // 2. 点击添加分类按钮,显示模态框
    $('#addBtn').on('click',function(){
        $('#addModal').modal('show');
    });

    // 3. 完成添加校验
    $('#form').bootstrapValidator({
        //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        // excluded: [':disabled', ':hidden', ':not(:visible)'],

        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //3. 指定校验字段
        fields: {
            //校验用户名，对应name表单的name属性
            categoryName: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入一级分类名称'
                    }
                    
                }
            }
        }

    });



    // 4. 注册表单校验成功事件,在事件中阻止默认的提交,通过ajax提交
    $("#form").on('success.form.bv', function (e) {
        e.preventDefault();
        //使用ajax提交逻辑

        $.ajax({
            type: 'post',
            url: '/category/addTopCategory',
            data: $('#form').serialize(),
            dataType: 'json',
            success: function( info ){
                console.log( info );
                if(info.success){
                    $('#addModal').modal('hide');

                    currentPage = 1;
                    render();

                    // 重置表单
                    $("#form").data('bootstrapValidator').resetForm(true);
                }              
            }
                
        })
    }); 
})