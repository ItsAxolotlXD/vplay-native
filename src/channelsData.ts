export interface Channel {
  id: string;
  name: string;
  logo: string;
  group: string;
  url: string;
}

export const CATEGORIES = [
  "Tất cả",
  "Yêu thích",
  "VTV",
  "K+",
  "VTC",
  "HTV",
  "VTVcab",
  "Địa phương",
  "Thiết yếu",
  "Phát thanh"
];

export const CHANNELS_DATA: Channel[] = [
  {
    id: "vtv1-hd",
    name: "VTV1 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/7/7e/VTV1_HD_2017-2022.png/revision/latest/scale-to-width-down/1000?cb=20250320104829&path-prefix=vi",
    group: "VTV",
    url: "https://live.fptplay53.net/fnxch2/vtv1hd_abr.smil/chunklist.m3u8"
  },
  {
    id: "vtv2-hd",
    name: "VTV2 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/5/55/VTV2_HD_logo_2015-2022.png/revision/latest/scale-to-width-down/1000?cb=20250110124118&path-prefix=vi",
    group: "VTV",
    url: "https://live.fptplay53.net/fnxch2/vtv2hd_abr.smil/chunklist.m3u8"
  },
  {
    id: "vtv3-hd",
    name: "VTV3 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/9/95/VTV3_HD_2016-2022.png/revision/latest/scale-to-width-down/1000?cb=20241031093609&path-prefix=vi",
    group: "VTV",
    url: "https://live-a.fptplay53.net/live/media/VTV3HD/live_hls_avc/index.m3u8"
  },
  {
    id: "vtv4-hd",
    name: "VTV4 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/4/42/VTV4_HD-0.png/revision/latest/scale-to-width-down/1000?cb=20221211002406&path-prefix=vi",
    group: "VTV",
    url: "https://live.fptplay53.net/fnxch2/vtv4hd_abr.smil/chunklist.m3u8"
  },
  {
    id: "vtv5-hd",
    name: "VTV5 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/b/b4/VTV5_HD_2017-2022.png/revision/latest/scale-to-width-down/1000?cb=20230507073421&path-prefix=vi",
    group: "VTV",
    url: "https://live-a.fptplay53.net/live/media/VTV5HD/live_hls_avc/index.m3u8"
  },
  {
    id: "vtv5-tnb-hd",
    name: "VTV5 Tây Nam Bộ HD",
    logo: "https://static.wikia.nocookie.net/logos/images/b/b4/VTV5_HD_2017-2022.png/revision/latest/scale-to-width-down/1000?cb=20230507073421&path-prefix=vi",
    group: "VTV",
    url: "https://live.fptplay53.net/fnxhd1/vtv5tnb_vhls.smil/chunklist_b5000000.m3u8"
  },
  {
    id: "vtv5-tn-hd",
    name: "VTV5 Tây Nguyên HD",
    logo: "https://static.wikia.nocookie.net/logos/images/b/b4/VTV5_HD_2017-2022.png/revision/latest/scale-to-width-down/1000?cb=20230507073421&path-prefix=vi",
    group: "VTV",
    url: "https://live.fptplay53.net/fnxhd1/vtv5taynguyen_vhls.smil/chunklist_b5000000.m3u8"
  },
  {
    id: "vtv6-hd",
    name: "VTV6 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/9/98/VTV6_HD_logo_21-02-2018_V2.png/revision/latest/scale-to-width-down/1000?cb=20230927091207&path-prefix=vi",
    group: "VTV",
    url: "https://static.wikia.nocookie.net/ftv/images/2/28/Imageacknksdnjkvsdvjkbs.png/revision/latest?cb=20260530031557&path-prefix=vi"
  },
  {
    id: "vtv7-hd",
    name: "VTV7 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/c/cb/VTV7_HD_logo_2019-2022_b%E1%BA%A3n_2.png/revision/latest/scale-to-width-down/1000?cb=20260419120732&path-prefix=vi",
    group: "VTV",
    url: "https://live.fptplay53.net/fnxhd1/vtv7hd_vhls.smil/chunklist_b5000000.m3u8"
  },
  {
    id: "vtv8-hd",
    name: "VTV8 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/e/e7/VTV8_HD_2017%2C_2018.png/revision/latest/scale-to-width-down/1000?cb=20230213091147&path-prefix=vi",
    group: "VTV",
    url: "https://live.fptplay53.net/epzhd1/vtv8hd_vhls.smil/chunklist_b5000000.m3u8"
  },
  {
    id: "vtv9-hd",
    name: "VTV9 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/4/45/VTV9_HD_logo_2017%2C_2018.png/revision/latest/scale-to-width-down/1000?cb=20230626081853&path-prefix=vi",
    group: "VTV",
    url: "https://live.fptplay53.net/epzch2/vtv9hd_abr.smil/chunklist_b4200000.m3u8"
  },
  {
    id: "vtv10-hd",
    name: "VTV10 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/d/d2/VTV10_30.03.2026-nay_v2.png/revision/latest?cb=20260427023458&path-prefix=uk",
    group: "VTV",
    url: "https://live.fptplay53.net/live/media/VTV_can_tho/live_hls_avc/index.m3u8"
  },
  {
    id: "vietnam-today-hd",
    name: "Vietnam Today HD",
    logo: "https://static.wikia.nocookie.net/logos/images/e/e1/Logo_Vietnam_Today_07-2025.png/revision/latest?cb=20260228055912&path-prefix=uk",
    group: "VTV",
    url: "https://live.fptplay53.net/fnxhd1/vntoday_vhls.smil/chunklist_b5000000.m3u8"
  },
  {
    id: "kplus-sport-1-hd",
    name: "K+ SPORT 1 HD",
    logo: "https://img.vtvprime.vn/T8J7b_G8h1L6R-P_-m9_6_P6P-g/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvazFzcG9ydDEucG5n",
    group: "K+",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=195"
  },
  {
    id: "kplus-sport-2-hd",
    name: "K+ SPORT 2 HD",
    logo: "https://img.vtvprime.vn/T8J7b_G8h1L6R-P_-m9_6_P6P-g/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvazFzcG9ydDIucG5n",
    group: "K+",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=196"
  },
  {
    id: "vtc1-hd",
    name: "VTC1 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/0/07/VTC1_logo_2017.png",
    group: "VTC",
    url: "https://live.fptplay53.net/fnxch2/vtc1hd_abr.smil/chunklist.m3u8"
  },
  {
    id: "vtc3-hd",
    name: "VTC3 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/5/52/VTC3_logo_2017.png",
    group: "VTC",
    url: "https://live.fptplay53.net/fnxch2/vtc3hd_abr.smil/chunklist.m3u8"
  },
  {
    id: "htv1-hd",
    name: "HTV1 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/2/26/HTV1_logo_ch%C3%ADnh_30-12-2024.png/revision/latest?cb=20260201034746&path-prefix=vi",
    group: "HTV",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=190"
  },
  {
    id: "htv2-hd",
    name: "HTV2 / Vie Channel HD",
    logo: "https://static.wikia.nocookie.net/logos/images/7/75/HTV2_logo_2010-nay.png/revision/latest/scale-to-width-down/1000?cb=20231116055125&path-prefix=vi",
    group: "HTV",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=191"
  },
  {
    id: "htv3-hd",
    name: "HTV3 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/e/e4/HTV3_2009-2019.png/revision/latest?cb=20240907084329&path-prefix=vi",
    group: "HTV",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=192"
  },
  {
    id: "htv4-hd",
    name: "HTV4 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/1/10/HTV4_logo_2014-2018.png/revision/latest?cb=20180814115707&path-prefix=vi",
    group: "HTV",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=9"
  },
  {
    id: "htv5-hd",
    name: "HTV5 / B Channel HD",
    logo: "https://static.wikia.nocookie.net/logos/images/b/bc/HTV5_Bchannel_logo_ch%C3%ADnh.png/revision/latest?cb=20260528063037&path-prefix=vi",
    group: "HTV",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=151"
  },
  {
    id: "htv7-hd",
    name: "HTV7 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/c/cf/HTV7_HD_logo_2017-2019.png/revision/latest?cb=20231211054022&path-prefix=vi",
    group: "HTV",
    url: "https://vc.101vn.com/htv/htvcmb.php?id=256"
  },
  {
    id: "htv9-hd",
    name: "HTV9 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/e/ea/HTV9_HD_logo_2021-2022.png/revision/latest/scale-to-width-down/1000?cb=20240315133319&path-prefix=vi",
    group: "HTV",
    url: "https://live.fptplay53.net/epzhd1/htv9hd_vhls.smil/chunklist_b5000000.m3u8"
  },
  {
    id: "htv-the-thao-hd",
    name: "HTV Thể Thao HD",
    logo: "https://static.wikia.nocookie.net/logos/images/4/4c/HTV_Th%E1%BB%83_thao_logo.png/revision/latest/scale-to-width-down/1000?cb=20231108113057&path-prefix=vi",
    group: "HTV",
    url: "https://live.fptplay53.net/epzhd1/htvcthethao_vhls.smil/chunklist_b5000000.m3u8"
  },
  {
    id: "on-sport-plus-hd",
    name: "ON SPORT + HD",
    logo: "https://img.vtvprime.vn/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvT04rU1BPUlQrLnBuZw==.png",
    group: "VTVcab",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=193"
  },
  {
    id: "on-football-hd",
    name: "ON FOOTBALL HD",
    logo: "https://img.vtvprime.vn/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvT04rRk9PVEJBTEwucG5n",
    group: "VTVcab",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=194"
  },
  {
    id: "on-trending-tv-hd",
    name: "ON TRENDING TV HD",
    logo: "https://img.vtvprime.vn/55xu-sW33ZbTdC_Jok1jkP6jWGpa3U96dXvvDuXoyz0/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvOGZjNzVhY2EtYjZhYS00MjYwLWIwMDMtZDRkYzg4OWI4ZGNkLnBuZw==.png",
    group: "VTVcab",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=186"
  },
  {
    id: "on-kids-hd",
    name: "Cartoon Kids HD",
    logo: "https://static.wikia.nocookie.net/logos/images/3/39/Cartoon_Kids_logo.png/revision/latest?cb=20201011133203&path-prefix=vi",
    group: "VTVcab",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=179"
  },
  {
    id: "on-golf-hd",
    name: "ON Golf HD",
    logo: "https://static.wikia.nocookie.net/logos/images/e/e1/ON_Golf_logo.png/revision/latest/scale-to-width-down/1000?cb=20211027130404&path-prefix=vi",
    group: "VTVcab",
    url: "https://toiyeuvietnam.dpdns.org/TuyetDoiKhongKinhDoanh/vtvcab-23-golf-channel/KenhCoBan.m3u8"
  },
  {
    id: "on-e-channel-hd",
    name: "ON E- Channel HD",
    logo: "https://static.wikia.nocookie.net/logos/images/6/69/ON_E_Channel_08-04-2023.png/revision/latest/scale-to-width-down/1000?cb=20231122022922&path-prefix=vi",
    group: "VTVcab",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=182"
  },
  {
    id: "on-vie-giai-tri-hd",
    name: "ON Vie Giải Trí HD",
    logo: "https://img.vtvprime.vn/gV1k4G1mCGQpnNGJFCJQISd0-p96jY14Ufz_mOb8h_o/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvZjVhZDhkNmItMTQ4NS00YjYxLThhMDEtNTdiYzBiMjU2NGU1LnBuZw==.png",
    group: "VTVcab",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=180"
  },
  {
    id: "on-vie-dramas-hd",
    name: "ON Vie Dramas HD",
    logo: "https://img.vtvprime.vn/mVzz9rvhJ_BCun2e4ILB0OYl8ptcxG9TsSrIZ85kpLk/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvMmExZjgwNGYtNjc0Yi00ZjYzLThjZWMtNjgwN2NkNThhYTRkLnBuZw==.png",
    group: "VTVcab",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=177"
  },
  {
    id: "on-phim-viet-hd",
    name: "ON Phim Việt HD",
    logo: "https://img.vtvprime.vn/vDASEJI2IRP0eBox0ta6hgKo4vnY-3AdofWLa5lSqjM/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvZTc3YzdkNmItZTVhNi00ZTkyLWIzYzUtMGEzMTkyZjIyM2RhLnBuZw==.png",
    group: "VTVcab",
    url: "https://vietanhtv.id.vn/tv360/175/index.m3u8"
  },
  {
    id: "on-movies-youtv-hd",
    name: "ON Movies - You TV HD",
    logo: "https://img.vtvprime.vn/8-eDFNeJkwyONvmJVu_JydPc2dZaNJXuBTY7vtvCxxE/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvZWQzOTEzNjgtYTJmNy00NDBkLWI0N2BeNzA2MDliNjJmNDYzLnBuZw==.png",
    group: "VTVcab",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=181"
  },
  {
    id: "on-o2tv-hd",
    name: "ON O2TV HD",
    logo: "https://img.vtvprime.vn/5FxYjiz34GsArbti7aFiSkIO7NMCxKNZcQJ9AvIme80/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvODAyNGIwMDQtNGJiNC00M2Y3LWJkYmEtYmU0MWVkMGY0NjM4LnBuZw==.png",
    group: "VTVcab",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=136"
  },
  {
    id: "on-bibi-hd",
    name: "ON BiBi HD",
    logo: "https://img.vtvprime.vn/vjXRRLGeFrNx1iAkqhrK9RoAgU1oW6kq5q_6r7cd9zs/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvYzI3NWExNmEtNTMwOS00ZWE3LWJjMjMtYTMyNGIwZDczNGJlLnBuZw==.png",
    group: "VTVcab",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=178"
  },
  {
    id: "on-info-tv-hd",
    name: "ON Info TV HD",
    logo: "https://img.vtvprime.vn/nCr-YgSmtNg5gcpJ35d6l_T4DUWz8fzr9EJpd9jAZ6E/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvM2E2NzM5NzQtNzRhYi00MjYxLTg2M2QtZWE2YzUyNzU5YzcyLnBuZw==.png",
    group: "VTVcab",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=189"
  },
  {
    id: "on-cine-hd",
    name: "ON Cine HD",
    logo: "https://img.vtvprime.vn/XY6SjolNpy8W8Eh_v_2oDyE6BiNOvofLosgPYO-hlY4/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvZTY5YjgyNmUtNjkzYi00YzBiLWFhZmYtNmFhZGFjZjFhZDA0LnBuZw==.png",
    group: "VTVcab",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=176"
  },
  {
    id: "on-style-tv-hd",
    name: "ON Style TV HD",
    logo: "https://img.vtvprime.vn/TxObOi0p9hC6K414i12Fk27SP8s_QKswAvPaRH2kK6M/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvNTcyOGM3MzEtOWE4OS00ZjljLTkyYTItMWVhODZmNzhiOWE4LnBuZw==.png",
    group: "VTVcab",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=184"
  },
  {
    id: "on-music-hd",
    name: "ON Music HD",
    logo: "https://img.vtvprime.vn/39RnkA6ZHfNSCcsMaaSivvTVwmWjeGsbqlQsmD7nuvQ/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvN2RmOTYzYTYtZWRkYS00MDdjLWIxYmYtYTAwODBhMTUyYTNlLnBuZw==.png",
    group: "VTVcab",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=185"
  },
  {
    id: "on-v-family-hd",
    name: "ON V Family HD",
    logo: "https://img.vtvprime.vn/8oeGePxG0Z-iJqm5biFVNdMdAlVHFDYsS0i7i3IpH2Y/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvOGI0YzYzOTgtNWJiOS00ODQ1LWE1ZjMtZTdhZTM5ZTc4NzVmLnBuZw==.png",
    group: "VTVcab",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=187"
  },
  {
    id: "on-life-hd",
    name: "ON Life HD",
    logo: "https://img.vtvprime.vn/cJ9URVIqC2BkU1gsT0IKiEy0tXDXqu7C4M3Ni3hjlgY/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvY2U2MWMwZGEtMWI1Zi00ZWJiL--EHz-f7fe5d74e88f.png",
    group: "VTVcab",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=188"
  },
  {
    id: "atv1-hd",
    name: "ATV1 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/8/81/ATV1_logo_09-07-2025.png/revision/latest/scale-to-width-down/1000?cb=20251109111844&path-prefix=vi",
    group: "Địa phương",
    url: "https://live.fptplay53.net/epzsd1/angiang01_hls.smil/chunklist.m3u8"
  },
  {
    id: "atv2-hd",
    name: "ATV2 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/2/24/ATV2_logo_09-07-2025.png/revision/latest/scale-to-width-down/1000?cb=20250823043314&path-prefix=vi",
    group: "Địa phương",
    url: "https://live.fptplay53.net/epzsd1/angiang_hls.smil/chunklist.m3u8"
  },
  {
    id: "atv3-hd",
    name: "ATV3 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/9/9f/ATV3_logo_09-07-2025.png/revision/latest/scale-to-width-down/1000?cb=20251109111209&path-prefix=vi",
    group: "Địa phương",
    url: "https://tv.angiangtv.vn/live/kgtv1/kgtv1.m3u8"
  },
  {
    id: "btv-hd",
    name: "BTV HD",
    logo: "https://static.wikia.nocookie.net/logos/images/9/91/BTV_HD_Bac_Ninh_logo.png/revision/latest/scale-to-width-down/1000?cb=20240414001634&path-prefix=vi",
    group: "Địa phương",
    url: "https://live.mediatech.vn/live/285f5f227e988ab4445a2138091d3d62e8d/playlist.m3u8"
  },
  {
    id: "ctv-hd",
    name: "CTV HD",
    logo: "https://static.wikia.nocookie.net/logos/images/a/a1/CTV_HD_C%C3%A0_Mau_b%E1%BA%A3n_2.png/revision/latest/scale-to-width-down/1000?cb=20221231094508&path-prefix=vi",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=46"
  },
  {
    id: "thtpct1-hd",
    name: "THTPCT HD",
    logo: "https://static.wikia.nocookie.net/logos/images/7/72/THTPCT.png/revision/latest/scale-to-width-down/1000?cb=20250703032839&path-prefix=vi",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=47"
  },
  {
    id: "thtpct2-hd",
    name: "HGTV HD",
    logo: "https://static.wikia.nocookie.net/logos/images/5/50/HGTV_HD_Hau_Giang_2022.png/revision/latest/scale-to-width-down/1000?cb=20250304062024&path-prefix=vi",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=61"
  },
  {
    id: "thtpct3-hd",
    name: "STV HD",
    logo: "https://static.wikia.nocookie.net/logos/images/d/df/STV_HD_2018-2025_%28STV2%29.png/revision/latest/scale-to-width-down/1000?cb=20231012100425&path-prefix=vi",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=84"
  },
  {
    id: "crtv-hd",
    name: "CRTV HD",
    logo: "https://static.wikia.nocookie.net/logos/images/3/35/CRTV_2016_16-9.png/revision/latest/scale-to-width-down/1000?cb=20251116143645&path-prefix=vi",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=48"
  },
  {
    id: "dnrt1-hd",
    name: "DNRT1 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/5/58/DNRT1_logo.png/revision/latest?cb=20260212223625&path-prefix=vi",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=49"
  },
  {
    id: "dnrt2-hd",
    name: "DNRT2 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/d/df/DNRT2_logo.png/revision/latest?cb=20260212223711&path-prefix=vi",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=80"
  },
  {
    id: "drt-hd",
    name: "DRT HD",
    logo: "https://static.wikia.nocookie.net/logos/images/8/8f/DRT_HD_logo_testcard_2025.png/revision/latest/scale-to-width-down/1000?cb=20250815051751&path-prefix=vi",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=51"
  },
  {
    id: "dtv-hd",
    name: "ĐTV HD",
    logo: "https://static.wikia.nocookie.net/logos/images/a/ac/%C4%90TV_logo_2014-2019_b%E1%BA%A3n_2.png/revision/latest/scale-to-width-down/1000?cb=20220720132707&path-prefix=vi",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=52"
  },
  {
    id: "dnrtv1-hd",
    name: "ĐNRTV1 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/7/70/%C4%90NRTV1_HD.png/revision/latest/scale-to-width-down/1000?cb=20211025154909&path-prefix=vi",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=53"
  },
  {
    id: "dnrtv2-hd",
    name: "ĐNRTV2 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/d/d0/%C4%90NRTV2_HD.png/revision/latest/scale-to-width-down/1000?cb=20211025161214&path-prefix=vi",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=255"
  },
  {
    id: "thdt1-hd",
    name: "THĐT1 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/a/a9/TH%C4%90T1_slogan_2023.png/revision/latest?cb=20231126064109&path-prefix=vi",
    group: "Địa phương",
    url: "https://live.fptplay53.net/epzsd1/dongthap_vhls.smil/chunklist_b5000000.m3u8"
  },
  {
    id: "thdt2-hd",
    name: "THĐT2 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/f/f9/Mi%E1%BB%81n_T%C3%A2y_TH%C4%90T2_2016-2019.png/revision/latest/scale-to-width-down/1000?cb=20230801075942&path-prefix=vi",
    group: "Địa phương",
    url: "https://live.fptplay53.net/epzsd1/dongthaphd_vhls.smil/chunklist_b5000000.m3u8"
  },
  {
    id: "gtv-hd",
    name: "GTV HD",
    logo: "https://static.wikia.nocookie.net/logos/images/b/b6/GTV_Gia_Lai.png/revision/latest/scale-to-width-down/732?cb=20250729030224&path-prefix=vi",
    group: "Địa phương",
    url: "https://live.fptplay53.net/epzsd1/gialai01_hls.smil/chunklist_b1800000.m3u8"
  },
  {
    id: "h1-hd",
    name: "H1 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/f/fd/HanoiTV1_HD_2016-2026.png/revision/latest?cb=20241227073715&path-prefix=vi",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=33"
  },
  {
    id: "h2-hd",
    name: "H2 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/d/d6/HanoiTV2_HD_2016-2026.png/revision/latest?cb=20241228131942&path-prefix=vi",
    group: "Địa phương",
    url: "https://live.fptplay53.net/fnxhd1/hntv2_vhls.smil/chunklist_b5000000.m3u8"
  },
  {
    id: "bhttv-hd",
    name: "BHTTV HD",
    logo: "https://static.wikia.nocookie.net/logos/images/2/24/BHT_TV_logo_c%C3%B3_website.png/revision/latest/scale-to-width-down/1000?cb=20250419234452&path-prefix=vi",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=58"
  },
  {
    id: "thp-hd",
    name: "THP HD",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/THP_logo.svg/500px-THP_logo.svg.png",
    group: "Địa phương",
    url: "https://live.mediatech.vn/live/285a4c99665fdf84e94956c66bc7dc7eb5d/chunklist.m3u8"
  },
  {
    id: "thp3-hd",
    name: "THD HD",
    logo: "https://static.wikia.nocookie.net/logos/images/1/17/HDTV_HD_2019-2023.png/revision/latest/scale-to-width-down/1000?cb=20230925063103&path-prefix=vi",
    group: "Địa phương",
    url: "https://live.mediatech.vn/live/28548ca35823d41426d8b3da7ed82bdab13/chunklist.m3u8"
  },
  {
    id: "trt-hd",
    name: "TRT HD",
    logo: "https://static.wikia.nocookie.net/logos/images/7/74/TRT_2021-2025.png/revision/latest/scale-to-width-down/1000?cb=20250225033334&path-prefix=vi",
    group: "Địa phương",
    url: "https://live.fptplay53.net/epzsd1/hue_hls.smil/chunklist.m3u8"
  },
  {
    id: "hytv-hd",
    name: "HYTV HD",
    logo: "https://static.wikia.nocookie.net/logos/images/9/9c/HY_HD_logo_2020.png/revision/latest/scale-to-width-down/1000?cb=20221103131120&path-prefix=vi",
    group: "Địa phương",
    url: "https://live.mediatech.vn/live/285f5449d7d7d2946e0bd2d54b7e60f25a4/chunklist.m3u8"
  },
  {
    id: "ktv-hd",
    name: "KTV HD",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/KTV_-_Kh%C3%A1nh_Ho%C3%A0.png",
    group: "Địa phương",
    url: "https://live.fptplay53.net/epzsd1/khanhhoa_hls.smil/chunklist.m3u8"
  },
  {
    id: "ktv1-hd",
    name: "KTV1 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/6/60/KTV1_HD_logo_01-05.07.2025.png/revision/latest/scale-to-width-down/1000?cb=20250708073336&path-prefix=vi",
    group: "Địa phương",
    url: "https://vietanhtv.id.vn/tv360/76/index.m3u8"
  },
  {
    id: "ltv-hd",
    name: "LTV HD",
    logo: "https://static.wikia.nocookie.net/logos/images/0/05/LTV_HD_Lai_Ch%C3%A2u_logo_06-06-2022_%28ph%C3%A1t_tr%C3%AAn_v%E1%BB%87_tinh%2C_c%C3%B3_website%29.png/revision/latest/scale-to-width-down/1000?cb=20240501091834&path-prefix=vi",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=68"
  },
  {
    id: "ltv1-hd",
    name: "LTV1 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/8/8d/LTV1_Lam_Dong_logo_11-14.07.2025.png/revision/latest/scale-to-width-down/1000?cb=20250912111500&path-prefix=vi",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=69"
  },
  {
    id: "ltv2-hd",
    name: "LTV2 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/3/38/LTV2_Lam_Dong_logo_02-09-2025.png/revision/latest/scale-to-width-down/1000?cb=20250912114106&path-prefix=vi",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=45"
  },
  {
    id: "lstv-hd",
    name: "LSTV HD",
    logo: "https://static.wikia.nocookie.net/logos/images/7/70/LSTV_logo.png/revision/latest?cb=20220629080800&path-prefix=vi",
    group: "Địa phương",
    url: "https://stream.langsontv.vn/live/285c78da0c246524c90917842f8de03bd21/chunklist.m3u8"
  },
  {
    id: "thlc-hd",
    name: "THLC HD",
    logo: "https://static.wikia.nocookie.net/logos/images/a/ad/THLC_2016.png/revision/latest?cb=20211224040641&path-prefix=vi",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=71"
  },
  {
    id: "ntv-hd",
    name: "NTV HD",
    logo: "https://img-zlr1.tv360.vn/image1/2020_09_23/1600821989411/75bfb004e210_640_360.png",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=74"
  },
  {
    id: "nbtv-hd",
    name: "NBTV HD",
    logo: "https://static.wikia.nocookie.net/logos/images/9/94/NBTV_Ninh_B%C3%ACnh_logo.png/revision/latest/scale-to-width-down/200?cb=20211204172020&path-prefix=vi",
    group: "Địa phương",
    url: "https://live.mediatech.vn/live/28597f8fd7ea5064d0f84ab00b3699dfd86/playlist.m3u8"
  },
  {
    id: "ptv-hd",
    name: "PTV HD",
    logo: "https://static.wikia.nocookie.net/logos/images/7/76/PTV_HD_logo_2020.png/revision/latest?cb=20251112120133&path-prefix=vi",
    group: "Địa phương",
    url: "https://live.fptplay53.net/fnxsd1/phutho_hls.smil/chunklist.m3u8"
  },
  {
    id: "qngtv1-hd",
    name: "QNgTV1 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/9/91/QNgTV_2025_b%E1%BA%A3n_2.png/revision/latest/scale-to-width-down/1000?cb=20250823105253&path-prefix=vi",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=81"
  },
  {
    id: "qngtv2-hd",
    name: "QNgTV2 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/9/91/QNgTV_2025_b%E1%BA%A3n_2.png/revision/latest/scale-to-width-down/1000?cb=20250823105253&path-prefix=vi",
    group: "Địa phương",
    url: "https://ace.hoiquan.click/module/IPTV/?id=QNgTV2&accKenh=vuminhthanh1"
  },
  {
    id: "qtv1-hd",
    name: "QTV1 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/a/a8/QTV_HD.png/revision/latest/scale-to-width-down/1000?cb=20230527082413&path-prefix=vi",
    group: "Địa phương",
    url: "https://Baoquangninh.vn/qtvlive/tv1live.m3u8"
  },
  {
    id: "qtv3-hd",
    name: "QTV3 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/1/19/QTV3_HD_b%E1%BA%A3n_2.png/revision/latest/scale-to-width-down/1000?cb=20231028035725&path-prefix=vi",
    group: "Địa phương",
    url: "https://Baoquangninh.vn/qtvlive/tv3live.m3u8"
  },
  {
    id: "qttv-hd",
    name: "QTTV HD",
    logo: "https://static.wikia.nocookie.net/logos/images/4/4e/QRTV_logo_28-01-2025.png/revision/latest/scale-to-width-down/1000?cb=20250311063146&path-prefix=vi",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=83"
  },
  {
    id: "stv-hd",
    name: "STV HD",
    logo: "https://static.wikia.nocookie.net/logos/images/7/73/STV_Son_La.png/revision/latest/scale-to-width-down/1200?cb=20250626171925&path-prefix=vi",
    group: "Địa phương",
    url: "https://cdn.sonlatv.vn/live/28595222e707a364251b8724717894baa46/playlist.m3u8"
  },
  {
    id: "ttv-hd",
    name: "Tây Ninh (TTV) HD",
    logo: "https://static.wikia.nocookie.net/logos/images/4/46/TTV_TayNinhTV.png/revision/latest/scale-to-width-down/1000?cb=20250703001544&path-prefix=vi",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=72"
  },
  {
    id: "tn-hd",
    name: "TN HD",
    logo: "https://static.wikia.nocookie.net/logos/images/4/42/TN_HD_logo_2017.png/revision/latest/scale-to-width-down/1000?cb=20231025071359&path-prefix=vi",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=88"
  },
  {
    id: "thanhhoa-ttv-hd",
    name: "Thanh Hoá (TTV) HD",
    logo: "https://static.wikia.nocookie.net/logos/images/a/af/Logo_TTV_Thanh_H%C3%B3a_13-10-2025_%28c%C3%B3_website%2C_B%E1%BA%A3n_1%29.png/revision/latest/scale-to-width-down/1000?cb=20251014112802&path-prefix=vi",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=89"
  },
  {
    id: "tuyenquang-ttv-hd",
    name: "Tuyên Quang (TTV) HD",
    logo: "https://static.wikia.nocookie.net/logos/images/6/66/TTV_Tuy%C3%AAn_Quang.png/revision/latest/scale-to-width-down/1000?cb=20220731123650&path-prefix=vi",
    group: "Địa phương",
    url: "https://streaming.tuyenquangtv.vn/channel/tuyenquang/playlist.m3u8"
  },
  {
    id: "thvl1-hd",
    name: "THVL1 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/3/32/THVL1_logo_ident_2025.png/revision/latest/scale-to-width-down/1000?cb=20251206083051&path-prefix=vi",
    group: "Địa phương",
    url: "https://live.fptplay53.net/epzch2/vinhlong1_abr.smil/chunklist_b4200000.m3u8?cb=20260406"
  },
  {
    id: "thvl2-hd",
    name: "THVL2 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/9/98/THVL2_logo_ident_2025.png/revision/latest/scale-to-width-down/1000?cb=20251206083053&path-prefix=vi",
    group: "Địa phương",
    url: "https://live.fptplay53.net/epzhd2/vinhlong2_vhls.smil/chunklist_b5000000.m3u8?cb=20260406"
  },
  {
    id: "thvl3-hd",
    name: "THVL3 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/2/29/THVL3_logo_ident_2025.png/revision/latest/scale-to-width-down/1000?cb=20251206083054&path-prefix=vi",
    group: "Địa phương",
    url: "https://live.fptplay53.net/epzhd2/vinhlong3_vhls.smil/chunklist_b5000000.m3u8?cb=20260406"
  },
  {
    id: "thvl4-hd",
    name: "THVL4 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/7/7e/THVL4_logo_ident_2025.png/revision/latest/scale-to-width-down/1000?cb=20251206083055&path-prefix=vi",
    group: "Địa phương",
    url: "https://live.fptplay53.net/epzhd2/vinhlong4hd_vhls.smil/chunklist_b5000000.m3u8?cb=20260406"
  },
  {
    id: "thvl5-hd",
    name: "THVL5 HD",
    logo: "https://static.wikia.nocookie.net/logos/images/3/3b/THVL5_logo_ident_2025.png/revision/latest/scale-to-width-down/1000?cb=20251206083057&path-prefix=vi",
    group: "Địa phương",
    url: "https://freem3u.xyz/api/live/play.m3u8?vid=91&cb=20260406"
  },
  {
    id: "antv-hd",
    name: "Truyền hình Công an Nhân dân (ANTV) HD",
    logo: "https://static.wikia.nocookie.net/logos/images/b/b8/ANTV_HD_logo_2018.png/revision/latest/scale-to-width-down/1000?cb=20240922115604&path-prefix=vi",
    group: "Thiết yếu",
    url: "https://live.fptplay53.net/fnxhd2/anninhtv_vhls.smil/chunklist_b5000000.m3u8"
  },
  {
    id: "qpvn-hd",
    name: "Truyền hình Quốc phòng Việt Nam (QPVN) HD",
    logo: "https://static.wikia.nocookie.net/logos/images/5/5d/QPVN.png/revision/latest/scale-to-width-down/1000?cb=20220827083916&path-prefix=vi",
    group: "Thiết yếu",
    url: "https://live.fptplay53.net/fnxhd2/quocphongvnhd_vhls.smil/chunklist_b5000000.m3u8"
  },
  {
    id: "vov1",
    name: "VOV1",
    logo: "https://static.wikia.nocookie.net/logos/images/0/0d/VOV1_logo_2017.png/revision/latest?cb=20220311024316&path-prefix=vi",
    group: "Phát thanh",
    url: "https://vov.vn/live/vov1.m3u8"
  },
  {
    id: "vov2",
    name: "VOV2",
    logo: "https://static.wikia.nocookie.net/logos/images/a/a4/VOV2_logo_2017.png/revision/latest?cb=20220311024317&path-prefix=vi",
    group: "Phát thanh",
    url: "https://vov.vn/live/vov2.m3u8"
  },
  {
    id: "vov3",
    name: "VOV3",
    logo: "https://static.wikia.nocookie.net/logos/images/a/a2/VOV3_logo_2017.png/revision/latest?cb=20220311024318&path-prefix=vi",
    group: "Phát thanh",
    url: "https://vov.vn/live/vov3.m3u8"
  },
  {
    id: "vovgt-hn",
    name: "VOV Giao thông Hà Nội",
    logo: "https://static.wikia.nocookie.net/logos/images/5/5e/VOV_Giao_th%C3%B4ng_logo_2017.png/revision/latest?cb=20220311024323&path-prefix=vi",
    group: "Phát thanh",
    url: "https://vov.vn/live/vovgt-hn.m3u8"
  },
  {
    id: "vovgt-hcm",
    name: "VOV Giao thông TP.HCM",
    logo: "https://static.wikia.nocookie.net/logos/images/5/5e/VOV_Giao_th%C3%B4ng_logo_2017.png/revision/latest?cb=20220311024323&path-prefix=vi",
    group: "Phát thanh",
    url: "https://vov.vn/live/vovgt-hcm.m3u8"
  }
];
