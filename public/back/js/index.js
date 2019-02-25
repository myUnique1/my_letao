$(function(){
  // 基于准备好的dom，初始化echarts实例
  var echarts_left = echarts.init(document.querySelector('.echarts_left'));

  // 指定图表的配置项和数据
  var option1 = {
    title: {
      text: '2019年注册人数'
    },
    tooltip: {},
    legend: {
      data: ['销量','人数']
    },
    xAxis: {
      data: ["1月", "2月", "3月", "4月", "5月", "6月"]
    },
    yAxis: {},
    series: [{
      name: '销量',
      type: 'bar',
      data: [1000, 200, 360, 200, 180, 400]
    },
    {
      name: '人数',
      type: 'bar',
      data: [500, 800, 460, 180, 880, 1200]
    }]
  };

  // 使用刚指定的配置项和数据显示图表。
  echarts_left.setOption(option1);


  var echarts_right = echarts.init(document.querySelector('.echarts_right'));

  option2 = {
    title: {
      text: '热门品牌销售',
      subtext: '2019年2月',
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['耐克', '阿迪', '新百伦', '特步', '安踏']
    },
    series: [
      {
        name: '品牌热销',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [
          { value: 335, name: '耐克' },
          { value: 310, name: '阿迪' },
          { value: 234, name: '新百伦' },
          { value: 135, name: '特步' },
          { value: 1548, name: '安踏' }
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0,0,0,0.5)'
          }
        }
      }
    ]
  };
  echarts_right.setOption(option2);


})