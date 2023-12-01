var mainUrl = "https://erp.vitax.one";
var indexData = new Vue({
  el: "#main",
  data: {
    isCheck: false,
    result: null,
    result_status: {
      status: "",
      tthaibchu: "",
      ttxlybchu: "",
    },
    status_mst:"",
    search: "",
    result: {},
    listSearch: [],
    mess: "",
    status: 0,
    temp: 0,
    mstnb: "",
    mst: "",
    link: "",
    ckey: "",
    cvalue: "",
    ccontent: "",
    tgtttbso: "",
    khmshdon: 1,
    hdon: 1,
    nbmst: "",
    khhdon: "",
    shdon: "",
    shdon: "",
    tgtttbso_temp: 0,
    filelist: [],
    base64File: "",
    formatSHDON: "",
    dataXml: {
      nbmst: "",
      tgtttbso: 0,
      shdon: 0,
      khhdgoc: "",
      mhdon: "",
      nky: "",
      ncc: "",
      dateStart: "",
      dateEnd: "",
      signTaxNumber: "",
      signCompanyNameNB: "",
      SerialNumber: "",
      nbten: "",
      nbdchi: "",
      mccqt: "",
      nmmst: "",
      nmten: "",
      nmdchi: "",
      signCompanyNameTCT: "",
      htmlContent: "",
      dateNow: "",
      signDateTCT: "",
      nlapval: "",
      nmstatus: "",
      nbstatus: "",
    },
    isshow: false,
  },

  created: function () {
    // document.getElementById("load").style.display = "block";
    //this.search = mst;
    if (this.search != "" && this.search != null) this.getProfile();
    //document.getElementById("load").style.display = "none";
    this.getCatpcha();
  },

  filters: {
    formatVnd(number) {
      var decimals = 0;
      var dec_point = ",";
      var thousands_sep = ".";
      var n = number,
        c = isNaN((decimals = Math.abs(decimals))) ? 2 : decimals;
      var d = dec_point == undefined ? "," : dec_point;
      var t = thousands_sep == undefined ? "." : thousands_sep,
        s = n < 0 ? "-" : "";
      var i = parseInt((n = Math.abs(+n || 0).toFixed(c))) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;

      return (
        s +
        (j ? i.substr(0, j) + t : "") +
        i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
        (c
          ? d +
          Math.abs(n - i)
            .toFixed(c)
            .slice(2)
          : "") +
        " ₫"
      );
    },
    dateTimeFormat(d) {
      if (!d) return "";
      return d.toLocaleString().replace(",", "").replace(/:.. /, " ");
    },
  },
  methods: {
    openTabs(el) {
      var btn = el.currentTarget;
      var electronic = btn.dataset.electronic;
      var tabLinks = document.querySelectorAll(".tablinks");
      var tabContent = document.querySelectorAll(".tabcontent");
      tabContent.forEach(function (el) {
        el.classList.remove("active");
      });

      tabLinks.forEach(function (el) {
        el.classList.remove("active");
      });

      document.querySelector("#" + electronic).classList.add("active");

      btn.classList.add("active");
    },
    submitFile: function () {
      // document.getElementById("load").style.display = "block";
      if (this.filelist.length > 0) {
        let formData = new FormData();
        formData.append("file", this.filelist[0]);
        axios
          .post(
            "https://erp.vitax.one/api/partner/Invoices/upload_file",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((response) => {
            this.dataXml = response.data.result;
            this.formatSHDON = response.data.formatSHDON;
            this.isshow = true;
            this.isCheck = false;
            this.search = "";
          });
      }
      // document.getElementById("load").style.display = "none";
    },
    getFile() {
      document.getElementById("assetsFieldHandle").click();
    },
    onChange: function () {
      // document.getElementById("load").style.display = "block";
      this.filelist = [...this.$refs.file.files];
      this.submitFile();
    },
    remove(i) {
      this.filelist.splice(i, 1);
    },
    dragover(event) {
      event.preventDefault();
    },
    dragleave(event) { },
    drop(event) {
      // document.getElementById("load").style.display = "block";
      event.preventDefault();
      this.$refs.file.files = event.dataTransfer.files;
      this.onChange(); // Trigger the onChange event manually
      // document.getElementById("load").style.display = "none";
    },
    openPageRegist() {
      window.open("https://app.vitax.one/account/register", "_blank");
    },
    openPageLogin() {
      window.open("https://app.vitax.one", "_blank");
    },

    openPageviTax() {
      window.open("https://info.vitax.one/", "_blank");
    },
    getCatpcha: function () {
      axios
        .create({
          baseURL: "https://erp.vitax.one",
          headers: {
            "Content-Type": "application/json",
          },
        })
        .get("/api/partner/Invoices/Captcha")
        .then((response) => {
          this.result = response.data.captcha;
          if (this.result != null) {
            this.ckey = this.result.key;
            this.ccontent = this.result.content; //"data:image/png;base64, "+
          }
        });
    },
    guestInvoices: async function () {
      var ttbangso = this.tgtttbso.replaceAll(".", "");
      axios
        .create({
          baseURL: "https://erp.vitax.one",
          headers: {
            "Content-Type": "application/json",
          },
        })

        .get(
          "/api/partner/Invoices/guest-invoices?khmshdon=" +
          this.khmshdon +
          "&hdon=01&nbmst=" +
          this.nbmst +
          "&khhdon=" +
          this.khhdon +
          "&shdon=" +
          this.shdon +
          "&tgtttbso=" +
          ttbangso +
          "&cvalue=" +
          this.cvalue +
          "&ckey=" +
          this.ckey
        )
        .then((response) => {
          this.result_status = response.data.invoice;
        });

      this.getCatpcha();
      this.isshow = false;
      this.isCheck = false;
      this.search = "";
    },

    formatPrice(value) {
      if (value === "") {
        this.tgtttbso = "";
      } else {
        let val = value.replace(/\./g, ""); // Xóa tất cả dấu chấm trong số
        let dotIndex = val.indexOf(",");
        if (dotIndex !== -1) {
          let integerPart = val
            .substring(0, dotIndex)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          let decimalPart = val.substring(dotIndex + 1);
          this.tgtttbso = integerPart + "," + decimalPart;
        } else {
          let integerPart = val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          this.tgtttbso = integerPart;
        }
      }
    },
    openTab: function (evt, tabName) {
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontentmst");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      document.getElementById(tabName).style.display = "block";
      evt.currentTarget.className += " active";
      var rstxtSearch = document.getElementById("txtSearch").value;
      var rsctyaddr = document.getElementById("ctyaddr").value;

      if (tabName == "AboutUs") {
        showitem();
        document.getElementById(
          "codepro-ads-bottom-left-corner"
        ).style.visibility = "visible";
        document.getElementById("map").style.visibility = "hidden";
      } else {
        document.getElementById(
          "codepro-ads-bottom-left-corner"
        ).style.visibility = "hidden";
        if (rsctyaddr != "") {
          document.getElementById("map").style.visibility = "visible";
        }
      }

      if (tabName == "ttchung") {
        if (rstxtSearch != "") {
          document.getElementById("ttchung").style.visibility = "visible";
          codeAddress();
        } else {
          document.getElementById("ttchung").style.visibility = "hidden";
        }
      }
      if (tabName == "kqua") {
        if (rstxtSearch != "") {
          document.getElementById("kqua").style.visibility = "visible";
        } else {
          document.getElementById("kqua").style.visibility = "hidden";
        }
      }

      if (tabName == "ttchung") {
        if (rstxtSearch != "") {
          document.getElementById("ttchung").style.visibility = "visible";
          codeAddress();
        }
        document.getElementById("Search").style.visibility = "visible";
      } else {
        document.getElementById("Search").style.visibility = "hidden";
      }
    },
    getProfile: function () {
      
      //document.getElementById('load').style.display='block';
    
      var rs = document.getElementById("searchMST").value;
      if (
        (rs != "Nhập thông tin mã số thuế" && rs != "") ||
        (this.search != "" && this.search != null)
      ) {
        // document.getElementById("load").style.display = "flex";
        //var url =  "https://tracuutct.vitax.one/api/Tracuu/tracuumst=" + this.search;
        axios
          .get(
           "https://tracuutct.vitax.one/api/Tracuu/tracuumst?mst=" + this.search,// "/api/partner/invoices/getmst?mst=" + this.search,
            {},
            {
              headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Credentials': 'true'
              },
            }
          )
          .then((response) => {
            debugger
           // this.result = response.data.result;
           this.isCheck = true;
            this.result = response.data;
            this.status_mst= response.data.status;
            this.getStatusTaxCode();
            this.getInfoTraCuu();
            // document.getElementById("load").style.display = "none";
            var i, tabcontent, tablinks;

            tabcontent = document.getElementsByClassName("tabcontentmst");
            for (i = 0; i < tabcontent.length; i++) {
              tabcontent[i].style.display = "none";
            }
            tablinks = document.getElementsByClassName("tablinks");
            for (i = 0; i < tablinks.length; i++) {
              tablinks[i].className = tablinks[i].className.replace(
                " active",
                ""
              );
            }
            document.getElementById("kqua").style.display = "block";
            var evt = document.getElementById("mainTab");
            evt.className += " active";

            document.getElementById("ttchung").style.visibility = "visible";
            document.getElementById("Search").style.visibility = "visible";
            document.getElementById("map").style.visibility = "visible";

            document.getElementById("ctyaddr").value = this.result.address;
            //  codeAddress();
          })
          .catch((err) => console.log(err));
        
      } else {
        alert("Vui lòng nhập mã số thuế muốn tra cứu");
        document.getElementById("txtSearch").value = "";
        document.getElementById("ttchung").style.visibility = "hidden";
        document.getElementById("Search").style.visibility = "hidden";
        document.getElementById("map").style.visibility = "hidden";
      }
      document.getElementById(
        "codepro-ads-bottom-left-corner"
      ).style.visibility = "hidden";
    },
    getStatusTaxCode: function () {
      axios
        .get(
          mainUrl + "/api/partner/Invoices/StatusByTaxCode?mst=" + this.search+"&status="+this.status_mst,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          this.mess = response.data.mess;
          this.status = response.data.status;
        });
    },
    getInfoTraCuu: function () {
      axios
        .get(mainUrl + "/api/partner/Invoices/getidcmpn?mst=" + this.search, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          (this.temp = response.data.temp),
            (this.tinhTrang =
              "VitaxOne phát hiện có thông tin cảnh báo liên quan"), //response.data.tinhTrang,
            (this.mstnb = response.data.cmpnID),
            (this.mst = response.data.mst),
            (this.link = response.data.link);
        });
    },
    //   getProfile_v1:function()
    //   {
    //     axios.create({
    //       baseURL: "http://tracuumst.winerp.org:8185",
    //       headers: {
    //           'Content-Type': 'application/json',
    //       }
    //   })
    //   .get('/api/invoices/getmst?mst='+this.search)
    //   .then(response => {
    //     debugger
    //     this.result = response.data.result;
    //   });
    //   },
  },
});
