var mainUrl = "https://erp.vitax.one";//"https://erp.vitax.one";
var parsedUrl = new URL(window.location.href);
var mst = parsedUrl.searchParams.get("mst");
var indexData = new Vue({
  el: "#main",
  data: {
    search: "",
    result: {},
    listSearch: [],
    mess:"",
    status:0,
    temp:0,
    mstnb:"",
    mst:"",
    link:"",
  },

  created: function () {
    document.getElementById("load").style.display = "block";
    this.search = mst;
    if (this.search != "" && this.search != null) this.getProfile();
    document.getElementById("load").style.display = "none";
  },

  methods: {
    CloseModal: function () {
      var modal = document.getElementById("myModal");
      modal.style.display = "none";
    },
    openTab: function (evt, tabName) {
      
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontent");
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


        if(tabName=="ttchung")
        {
          if(rstxtSearch !="" )
          {
            document.getElementById('ttchung').style.visibility = 'visible';       
            codeAddress();     
          }
          document.getElementById("Search").style.visibility = "visible";
        } else {
          document.getElementById("Search").style.visibility = "hidden";
        }
      },
    BingSearch: function (data) {
      axios
        .create({
          baseURL: mainUrl,
          headers: {
            "Content-Type": "application/json",
          },
        })
        .get("/api/Invoices/bingSearch?value=" + data)
        .then((res) => {
          this.listSearch = res.data.rs.webPages.value;
        });

      //  var modal = document.getElementById("myModal");
      //  modal.style.display = "block";
      //$('#global-modal').modal('show');
      // document.getElementById("global-modal").style.display = "block";
    },
    getProfile_v1: function () {
      axios
        .create({
          baseURL: mainUrl,
          headers: {
            "Content-Type": "application/json",
          },
        })
        .get("/api/partner/invoices/getmst?mst=" + this.search)
        .then((response) => {
          this.result = response.data.result;
        });
    },

    getProfile: function () {
      //document.getElementById('load').style.display='block';
      var rs = document.getElementById("searchMST").value;
      if ((rs != "Nhập thông tin mã số thuế" && rs != "") || (this.search != "" && this.search != null)) 
      {
        document.getElementById("load").style.display = "flex";
        axios
          .get(
            mainUrl + "/api/partner/invoices/getmst?mst=" + this.search,
            {},
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            this.result = response.data.result;
            document.getElementById("load").style.display = "none";
            var i, tabcontent, tablinks;

            tabcontent = document.getElementsByClassName("tabcontent");
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
          this.getStatusTaxCode();
          this.getInfoTraCuu();
      } 
      else {
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
    getStatusTaxCode:function()
    {
      axios.get(mainUrl + "/api/partner/Invoices/StatusByTaxCode?mst=" + this.search,
              {
                headers: {
                  "Content-Type": "application/json",
                }
            }
          ).then(response => {
            
             this.mess = response.data.mess;
             this.status = response.data.status;
           });
    },
    getInfoTraCuu:function()
    {
      axios.get(mainUrl + "/api/partner/Invoices/getidcmpn?mst=" + this.search,
              {
                headers: {
                  "Content-Type": "application/json",
                }
            }
          ).then(response => {
            
            this.temp = response.data.temp,
            this.tinhTrang = "VitaxOne phát hiện có thông tin cảnh báo liên quan",//response.data.tinhTrang,
            this.mstnb = response.data.cmpnID,
            this.mst =response.data.mst,
            this.link = response.data.link
           });
    },
    fNumberFormat(n) {
      return new Intl.NumberFormat().format(n);
    },

    formatDay(value) {
      return moment(String(value)).format("DD-MM-YYYY HH:MM:SS");
      //return value;
    },
  },
});

var geocoder;
var map;
function initialize() {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(-34.397, 150.644);
  var mapOptions = {
    zoom: 16,
    center: latlng,
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

function codeAddress() {
  var address = document.getElementById("ctyaddr").value;
  geocoder.geocode({ address: address }, function (results, status) {
    if (status == "OK") {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
      });
    } else {
      // alert('Geocode was not successful for the following reason: ' + status + ' Addrr: ' + address);
    }
  });
}

//window.initMap = initMap;
