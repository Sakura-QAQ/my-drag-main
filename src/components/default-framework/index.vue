<!--
 * @Description: 自定义表格的组件选择组件
 -->
<template>
  <div class="w100 h100 default-framework-container">
    <div class="components-container">
      <div
        class="components-row"
        v-for="(component, componentIndex) in componentDatas"
        :key="componentIndex"
      >
        <div class="preview-box">
          <div
            class="preview"
            :id="component.id"
            v-show="component.type === 'chart'"
            draggable="true"
            @dragstart="handleDragCol($event, component)"
            @dragend="hanDragColEnd($event, component)"
          />

          <div
            class="table"
            v-show="component.type === 'table'"
            draggable="true"
            @dragstart="handleDragCol($event, component)"
            @dragend="hanDragColEnd($event, component)"
          >
            <el-table
              :data="component.tableBody"
              style="width: 100%"
              :cell-style="() => setCellStyle(component)"
              :header-cell-style="() => setHeadCellStyle(component)"
              size="small"
            >
              <template v-for="i in component.tableHead">
                <el-table-column :prop="i.prop" :label="i.label" :key="i.label">
                </el-table-column>
              </template>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "default-framework",
  data() {
    return {
      currentColChartId: 0,
      currentColTableId: 0,
      componentDatas: [
        {
          id: "chart1",
          type: "chart",
          chartData: {
            title: {
              text: "柱状图",
              textStyle: {
                fontSize: "20",
                color: "#fff",
              },
            },
            tooltip: {},
            xAxis: {
              data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
              axisLabel: {
                color: "#fff",
                fontSize: "12",
              },
            },
            yAxis: {
              axisLabel: {
                color: "#fff",
                fontSize: "12",
              },
            },
            series: [
              {
                type: "bar",
                data: [5, 20, 36, 10, 10, 20],
                itemStyle: {
                  color: "#61a0a8",
                },
              },
            ],
          },
        },
        {
          id: "chart2",
          type: "chart",
          chartData: {
            title: {
              text: "折线图",
              textStyle: {
                fontSize: "20",
                color: "#fff",
              },
            },
            tooltip: {},
            xAxis: {
              data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              axisLabel: {
                color: "#fff",
                fontSize: "12",
              },
            },
            yAxis: {
              type: "value",
              axisLabel: {
                color: "#fff",
                fontSize: "12",
              },
            },
            series: [
              {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: "line",
                itemStyle: {
                  color: "#58afec",
                },
              },
            ],
          },
        },
        {
          id: "table1",
          type: "table",
          style: {
            head: {
              fontSize: "13px",
              color: "#fff",
              textAlign: "center",
              backColor: "#fff",
              padding: "10px 0",
              border: "1px solid #dcdcdc",
            },
            body: {
              fontSize: "13px",
              color: "#fff",
              textAlign: "center",
              backColor: "#fff",
              padding: "10px 0",
              border: "1px solid #dcdcdc",
            },
          },
          tableHead: [
            { label: "日期", prop: "date" },
            { label: "姓名", prop: "name" },
            { label: "地址", prop: "address" },
          ],
          tableBody: [
            {
              date: "2016-05-02",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1518 弄",
            },
            {
              date: "2016-05-04",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1517 弄",
            },
            {
              date: "2016-05-01",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1519 弄",
            },
            {
              date: "2016-05-03",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1516 弄",
            },
          ],
        },
      ],
    };
  },
  methods: {
    handleDragCol(event, col) {
      if (col.type == "chart") {
        col.id = `chart${++this.currentColChartId}`;
      } else if (col.type == "table") {
        col.id = `table${++this.currentColTableId}`;
      }
      this.$emit("drag-col-start", event, col);
    },
    hanDragColEnd(event, col) {
      this.$emit("drag-col-end", event, col);
    },

    setCellStyle(col) {
      if (col.type === "table") {
        return `color:${col.style.body.color};font-size:${col.style.body.fontSize};text-align:${col.style.body.textAlign};border-bottom:${col.style.body.border};background-color:${col.style.body.backColor}`;
      }
    },
    setHeadCellStyle(col) {
      if (col.type === "table") {
        return `color:${col.style.head.color};font-size:${col.style.head.fontSize};text-align:${col.style.head.textAlign};border-bottom:${col.style.head.border};background-color:${col.style.body.backColor}`;
      }
    },
  },
  mounted() {
    for (let i = 0; i < this.componentDatas.length; i++) {
      if (this.componentDatas[i].chartData) {
        let myChart = this.$echarts.init(
          document.getElementById(this.componentDatas[i].id)
        );
        myChart.setOption(this.componentDatas[i].chartData);
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variable.scss";

.default-framework-container {
  @include default-flex;
  flex-wrap: wrap;
  text-align: center;
  flex-flow: column;
  height: 100%;
  padding: 1rem;
  padding-top: 2rem;
  overflow: auto;
  .components-container {
    @include default-flex;
    width: 100%;
    flex: 1;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
    flex-flow: column;
    padding: 0.5rem;
    overflow: auto;
    & .components-row {
      @include default-flex;
      @include default-col-radius;
      @include boxShadow;
      align-items: flex-start;
      flex-flow: wrap;
      // padding: 0 1rem;
      width: 100%;
      min-height: 200px;
      margin: 1rem 0;
      background-color: #f5f5f5;
      & .components-infos-box {
        width: 100%;
      }
      & .preview-box {
        @include default-flex;
        & .preview {
          overflow: auto;
          width: 380px;
          height: 200px;
          // @include cur-all;
          // @include default-background-img;
        }
        .table {
          overflow: auto;
          width: 400px;
          height: 200px;
          padding: 5px;
        }
      }
    }
  }
}
</style>
