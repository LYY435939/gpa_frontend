<template>
  <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      title="成绩详情"
      :sub-title="this.activeKey==='1'?'GPA':'排名'"
      @back="back"
  >
    <template #extra>
      <a-button type="default" shape="circle" size="small" style="cursor: pointer" @click="updateAll">
        <template #icon>
          <SyncOutlined/>
        </template>
      </a-button>
      <a-button type="danger" shape="circle" size="small" style="cursor: help" @click="this.visible=true">
        <template #icon>
          <QuestionOutlined/>
        </template>
      </a-button>
    </template>
    <a-tabs v-model:activeKey="this.activeKey" @change="handleTabs">
      <a-tab-pane key="1" tab="GPA">
        <a-layout style="height: 80vh;background: rgba(0,0,0,0);">
          <a-layout-header
              style="padding:0 20px 10px 20px;height: 20px;font-size:20px;line-height:20px;background: rgba(0,0,0,0);">
            <div style="text-align: center;font-weight:bold">
                <span style="display:inline-block;width: 20vw;color: #67C23A">
                  {{ totalGrade.toFixed(4) }}
                </span>
              <a-divider type="vertical"/>
              <span style="display:inline-block;width: 20vw;color: #E6A23C">
                  {{ totalGPA.toFixed(4) }}
                </span>
              <a-divider type="vertical"/>
              <span style="display:inline-block;width: 20vw;">
                  {{ totalCredits.toFixed(1) }}
              </span>
            </div>
          </a-layout-header>
          <a-layout-content>
            <a-layout style="height: 80vh;background: rgba(0,0,0,0);">
              <a-layout-header
                  style="padding:10px 6px;height: 14px;font-size:14px;line-height:14px;background: rgba(0,0,0,0);text-align: center;">
                <span style="font-weight:bold">
                  {{ gpa[selSem - 1].name }}
                </span>
                <a-divider type="vertical" style="margin: 0 2vw"/>
                <span style="color: #67C23A">
                  {{ semesterScore[selSem - 1].grade.toFixed(4) }}
                </span>
                <a-divider type="vertical" style="margin: 0 2vw"/>
                <span style="color: #E6A23C">
                  {{ semesterScore[selSem - 1].gpa.toFixed(4) }}
                </span>
                <a-divider type="vertical" style="margin: 0 2vw"/>
                <span>
                  {{ semesterScore[selSem - 1].credits.toFixed(1) }}
                </span>
                <a-divider type="vertical" style="margin: 0 2vw"/>
                <a-switch size="small" v-model:checked="semesterSel[selSem - 1]"
                          @change="changeAllState(selSem-1)"/>
              </a-layout-header>
              <a-layout-content>
                <div style="align-content: center">
                  <el-scrollbar max-height="65vh" style="padding-top: 10px">
                    <a-list item-layout="horizontal" size="large"
                            :data-source="gpa[selSem-1].courses">
                      <template #renderItem="{ item }">
                        <a-list-item style="padding: 8px 12px">
                          <template #actions>
                            <a-switch size="small" v-model:checked="item.sel"
                                      @change="updateScore"/>
                          </template>
                          <a-list-item-meta>
                            <template #description>
                              <div style="font-size: 14px;line-height: 14px;height:14px;">
                              <span style="display:inline-block;width: 10vw;color: #67C23A">
                                {{ item.grade }}
                              </span>
                                <a-divider type="vertical"/>
                                <span style="display:inline-block;width: 10vw;color: #E6A23C">
                                {{ item.gpa.toFixed(1) }}
                              </span>
                                <a-divider type="vertical"/>
                                <span style="display:inline-block;width: 10vw;">
                                {{ item.credits.toFixed(1) }}
                              </span>
                              </div>
                            </template>
                            <template #title>
                              {{ item.name }}
                            </template>
                          </a-list-item-meta>
                        </a-list-item>
                      </template>
                    </a-list>

                  </el-scrollbar>
                  <a-pagination style="position:absolute;bottom:0;right:0;padding-top: 10px"
                                size="small" :pageSize="1"
                                v-model:current="this.selSem"
                                :total="this.maxLen" @change="onChange"
                                :show-total="total => `共 ${total} 个学期`"/>
                </div>
              </a-layout-content>
            </a-layout>
          </a-layout-content>
        </a-layout>
      </a-tab-pane>
      <a-tab-pane key="2" tab="排名">
        <a-layout style="height: 80vh;background: rgba(0,0,0,0);">
          <a-layout-header
              style="padding:0 20px 20px 20px;height: 25px;font-size:25px;line-height:25px;background: rgba(0,0,0,0);font-weight:bold">
            <div style="text-align: center">
              <a-space>
                <span>{{ this.rank.rank }}</span>
                <span>{{ '/' }}</span>
                <span>{{ this.rank.num[5] }}</span>
              </a-space>
            </div>
          </a-layout-header>
          <a-layout-content style="margin-top: 5vh">
            <a-row type="flex" justify="center" align="middle" style="text-align: center">
              <a-col :span="12">
                <el-progress type="circle" :percentage="percentage" :color="colors"/>
              </a-col>
              <a-col :span="12">
                <div>
                  您在全年级前{{ percentage }}%！
                </div>
              </a-col>
            </a-row>
            <a-row type="flex" justify="center" align="middle" style="text-align: center;margin-top: 5vh">
              <a-col :span="8">
                <a-card>
                  <a-statistic
                      title="前一名"
                      :value="this.rank.beforeRankGpa ===null?'NULL':this.rank.beforeRankGpa.toFixed(3)"
                      :precision="3"
                      :value-style="{ color: '#3f8600' }"
                  >
                    <template #prefix>
                      <arrow-up-outlined/>
                    </template>
                  </a-statistic>
                </a-card>
              </a-col>
              <a-col :span="8">
                <a-card style="height: 100%;">
                  <a-statistic
                      title="GPA"
                      :value="this.rank.gpa"
                      :precision="3"
                      :value-style="{ color: '#E6A23C' }"
                  >
                    <template #prefix>
                      <MinusOutlined/>
                    </template>
                  </a-statistic>
                </a-card>
              </a-col>
              <a-col :span="8">
                <a-card>
                  <a-statistic
                      title="后一名"
                      :value="this.rank.afterRankGpa ===null?'NULL':this.rank.afterRankGpa.toFixed(3)"
                      :precision="3"
                      :value-style="{ color: '#cf1322' }"
                  >
                    <template #prefix>
                      <arrow-down-outlined/>
                    </template>
                  </a-statistic>
                </a-card>
              </a-col>
              <div ref="rankChart" class="echarts" id="rankChart" style="width: 100%;height: 30vh"></div>
            </a-row>
            <a-row type="flex" justify="center" align="middle"
                   style="text-align: center;margin-top: 5vh;width: 90vw">

            </a-row>
          </a-layout-content>
        </a-layout>

      </a-tab-pane>
    </a-tabs>
  </a-page-header>
  <a-modal v-model:visible="visible" title="成绩查询说明"
           @ok="this.visible=false" @cancel="this.visible=false"
           ok-text="OK"
           cancel-text="CANCEL">
    <el-scrollbar max-height="90vw">
      <div>
        <p>
          1.优秀/A：90 良好/B：80 中等/C：70 及格/D：60 P：60 其它以0计；
        </p>
        <p>
          2.P的课程GPA以1.0计，百分成绩按照60计；
        </p>
        <p>
          3.翱翔门户百分成绩未按学分加权，iNWPU加权；
        </p>
        <p>
          4.翱翔门户GPA默认包含所有非1.0课程绩点，iNWPU中可自行打开；
        </p>
        <p>
          5.排名未包含并列情况，例如：90、90，89，则排名显示时89为第二名，真实排名数值约有10%的上浮；
        </p>
        <p>
          6.其它一切情况以翱翔门户教务系统为准。
        </p>
      </div>
    </el-scrollbar>
  </a-modal>
</template>

<script>
import {QuestionFilled, CaretTop} from '@element-plus/icons-vue'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
  QuestionCircleTwoTone,
  QuestionOutlined,
  DownloadOutlined,
  SyncOutlined,
} from '@ant-design/icons-vue';
import {ref} from "vue";
import * as echarts from "echarts"
import api from "@/api";

export default {
  name: "MainView",
  components: {
    QuestionFilled,
    QuestionCircleTwoTone,
    ArrowUpOutlined,
    CaretTop,
    MinusOutlined,
    ArrowDownOutlined,
    QuestionOutlined,
    DownloadOutlined,
    SyncOutlined
  },
  data() {
    return {
      username: "",
      selSem: ref(1),
      maxLen: 1,
      visible: false,
      QuestionFilled: QuestionFilled,
      QuestionCircleTwoTone: QuestionCircleTwoTone,
      activeKey: '1',
      totalGPA: 0.0,
      totalGrade: 0.0,
      totalCredits: 0.0,
      gpa: [],
      semesterSel: [],
      semesterScore: [],
      rank: {
        afterRankGpa: 0.000,
        avgMajorGpa: 0.000,
        beforeRankGpa: 0.000,
        gpa: 0.000,
        num: [
          0, 0, 0, 0, 0, 0
        ],
        rank: 0,
        studentAssoc: 0
      },
      percentage: 0,
      colors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#6f7ad3', percentage: 100},
      ],
      position: 1,
      left: 0,
      option: {
        title: [
          {
            show: true,
            text: "您在年级中的位置",
            textStyle: {
              fontWeight: "normal",
              fontSize: "14",
            },
            x: "center",
            y: "top",
            textAlign: "left",
          },
          {
            show: true,
            text: "↓",
            textStyle: {
              fontWeight: 'bolder',
              fontSize: "20",
              color: "#FF0000"
            },
            left: "0px",
            top: '5%',
            textAlign: "center",
          },
        ],
        xAxis: {
          boundaryGap: false,
          barWidth: '100%',
          data: ["[100, 90]", "(90, 80]", "(80, 70]", "(70, 60]", "(60, 0]"],
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
        },
        yAxis: {
          boundaryGap: false,
          show: false,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            type: "bar",
            data: [],
            barWidth: "100%",
            itemStyle: {
              barBorderRadius: 0,
              borderWidth: 0,
              borderType: "solid",
              borderColor: "#73c0de",
              shadowColor: "#73c0de",
              shadowBlur: 3
            },
            label: {
              normal: {
                position: 'top',
                color: '#000000',
                show: true,
              }
            },
          }
        ]
      }
    }
  },
  created() {
    this.username = this.$route.params.username;
    this.init();
  },
  mounted() {
    setTimeout(() => {
      this.initEcharts()
    }, 5000);
  },
  methods: {
    init() {
      let data = JSON.parse(localStorage.getItem(this.username))
      this.gpa = data.gpa;
      this.maxLen = this.gpa.length;
      console.log(this.maxLen)
      this.rank = data.rank;
      this.gpa.forEach(function (s) {
        s.courses.forEach(function (c) {
          let g = c.grade.toString();
          let reg1 = new RegExp("[\\u4E00-\\u9FFF]+", "g")
          let reg2 = new RegExp("[A-Za-z\\-]+", "g")
          let r1 = reg1.test(g)
          let r2 = reg2.test(g);
          c.sel = (!r1) && (!r2);
          if (c.gpa === null)
            c.gpa = 0.0;
          if (c.sel === true) {
            c.actualGrade = parseFloat(c.grade);
          } else {
            if (r2) {
              if (g.search("A") !== -1) {
                c.actualGrade = 90.0;
              } else if (g.search("B") !== -1) {
                c.actualGrade = 80.0;
              } else if (g.search("C") !== -1) {
                c.actualGrade = 70.0;
              } else if (g.search("D") !== -1) {
                c.actualGrade = 60.0;
              } else if (g.search("P") !== -1) {
                c.actualGrade = 60.0;
                c.gpa = 1.0;
              } else {
                c.actualGrade = 0.0;
              }
            } else {
              if (g.search("优") !== -1) {
                c.actualGrade = 90.0;
              } else if (g.search("良") !== -1) {
                c.actualGrade = 80.0;
              } else if (g.search("中") !== -1) {
                c.actualGrade = 70.0;
              } else if (g.search("及格") !== -1) {
                c.actualGrade = 60.0;
              } else {
                c.actualGrade = 0.0;
              }
            }
          }
        })
      });
      console.log(this.gpa);
      console.log(this.rank);
      for (let s of this.gpa) {
        let flag = true;
        for (let c of s.courses) {
          if (c.sel) {
            this.semesterSel.push(true);
            flag = false;
            break;
          }
        }
        if (flag) {
          this.semesterSel.push(false);
        }
      }
      for (let i = 0; i < this.gpa.length; i++) {
        this.semesterScore.push({
          grade: 0.0,
          gpa: 0.0,
          credits: 0.0
        });
      }
      this.updateScore();
      this.updateRank();
      this.option.series[0].data = this.rank.num;
      let tmp = this.rank.rank;
      for (let i = 0; i < this.rank.num.length; i++) {
        tmp -= this.rank.num[i];
        if (tmp <= 0) {
          this.left = this.rank.num[i] + tmp;
          this.position = i;
          break;
        }
      }
      let val = this.option.series[0].data[this.position];
      this.option.series[0].data[this.position] = {
        value: val,
        itemStyle: {
          color: "pink",
        }
      }
    },
    handleTabs() {
      if (this.activeKey === '2') {
        setTimeout(() => {
          this.initEcharts()
        }, 50);
      }
    },
    setPercent() {
      const cn = document.getElementsByTagName("canvas")[0];

    },
    initEcharts() {
      const chartDom = document.getElementById('rankChart');
      let w = Number(window.getComputedStyle(chartDom).width.replace("px", ""));
      let minP = 10, maxP = w - 10 - 1;
      let percent = this.position * 20 + this.left / Number(this.rank.num[this.position].value) * 20;
      let goal = percent * w / 100;
      goal = Math.max(minP, goal);
      goal = Math.min(maxP, goal);
      this.option.title[1].left = goal.toFixed(2) + "px";

      const rankChart = echarts.init(chartDom);
      rankChart.setOption(this.option);
      window.addEventListener("resize", () => {
        rankChart.resize();
      });
    },
    onChange(pageNumber) {
      console.log('Page: ', pageNumber);
    },
    changeAllState(id) {
      let goal = this.semesterSel[id];
      this.gpa[id].courses.forEach((c) => {
        c.sel = goal;
      });
      this.updateScore();
    },
    updateRank() {
      this.percentage = Number((100 * this.rank.rank / this.rank.num[5]).toFixed(0));
    },
    updateScore() {
      let allGPA = 0.0, allGrade = 0.0, allCredits = 0.0;
      for (let i = 0; i < this.gpa.length; i++) {
        let sGPA = 0.0, sGrade = 0.0, sCredits = 0.0;
        for (let j = 0; j < this.gpa[i].courses.length; j++) {
          if (this.gpa[i].courses[j].sel) {
            sGPA += this.gpa[i].courses[j].gpa * this.gpa[i].courses[j].credits;
            sGrade += this.gpa[i].courses[j].actualGrade * this.gpa[i].courses[j].credits;
            sCredits += this.gpa[i].courses[j].credits;
          }
        }
        allGPA += sGPA;
        allGrade += sGrade;
        allCredits += sCredits;
        this.semesterScore[i] = {
          grade: sGrade / sCredits,
          gpa: sGPA / sCredits,
          credits: sCredits
        }
      }
      this.totalGPA = allGPA / allCredits;
      this.totalGrade = allGrade / allCredits;
      this.totalCredits = allCredits;
    },
    back() {
      localStorage.removeItem(this.username);
      this.$router.go(-1);
    },
    updateAll() {
      let k = this.username;
      this.$message.info("请求中，请等待");
      api.getUserScore({
        username: k,
      }).then((response) => {
        if (response.data.success) {
          this.$message.success(response.data.message);
          localStorage.setItem(k, JSON.stringify(response.data.data));
          this.init();
        } else {
          this.$message.error(response.data.message);
        }
      }).catch((error) => {
        this.$message.error(error.toString());
      })
    },
  }
}
</script>

<style scoped>

.el-menu-vertical-demo {
  position: absolute;
  top: 0;
  bottom: 0;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}

.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

</style>
<style>

svg {
  display: inline !important;
  vertical-align: baseline !important;
}

</style>