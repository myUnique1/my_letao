$(function(){

    // 1. 发送ajax,返回数据,渲染页面
    var currentPage = 1;
    var pageSize = 5;

    render();

    function render(){
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                var htmlstr = template('secondTpl', info);
                $('tbody').html(htmlstr);


                //渲染分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,//指定bootstrap的版本，如果是3，必须指定
                    currentPage: info.page,//指定当前页
                    totalPages: Math.ceil(info.total / info.size),//指定总页数
                    onPageClicked: function (a, b, c, page) {
                        //page指的是点击的页码,修改了当前页
                        console.log(page);
                        
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

        // 发送ajax请求,获取一级分类的全部数据
        // 渲染到一级分类中
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: 'json',
            success: function( info ){
                console.log(info);
                var htmlstr = template('dropdownTpl',info);
                $('.dropdown-menu').html(htmlstr);
                
            }
        })
    })

    // 3.给下拉菜单添加可选功能
    $('.dropdown-menu').on('click', 'a',function(){
        var txt = $(this).text();
        $('#dropdownText').text(txt);
    })



   
})