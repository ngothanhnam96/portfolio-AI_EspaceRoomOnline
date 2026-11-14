// Đà Nẵng — Phòng Khách Sạn Bên Sông Hàn. Six quests; the letters spell DANANG.

export default {
  id: "danang",
  name: "Đà Nẵng",
  region: "Miền Trung",
  room: "Phòng 1013 Bên Sông Hàn",
  tagline: "Căn phòng khách sạn nhìn thẳng ra Cầu Rồng lấp lánh trong đêm.",
  story:
    "Bạn nhận phòng 1013 của một khách sạn bên sông Hàn. Khi quay lại sau bữa tối, thẻ từ không còn mở được cửa: "
    + "lễ tân đã đổi khóa thành một ổ khóa chữ và gửi lên sáu câu đố về thành phố. "
    + "Giải hết trước khi Cầu Rồng thức giấc!",
  outro: "Cửa phòng bật mở đúng lúc Cầu Rồng phun lửa rực sáng cả dòng sông Hàn.",
  timeLimit: 18 * 60,
  difficulty: 2,
  map: { lon: 108.22, lat: 16.07, label: "right" },
  theme: { accent: "#4fc3f7", glow: "#9be7ff" },
  final: {
    word: "DANANG",
    prompt: "Ổ khóa chữ có sáu ô. Xếp các chữ cái bạn thu được thành tên thành phố bên sông Hàn.",
  },
  quests: [
    {
      id: "brochure",
      object: "Tờ rơi trên bậu cửa sổ",
      title: "Tờ Rơi Khách Sạn",
      type: "choice",
      prompt:
        "Tờ rơi ghi: «Đừng bỏ lỡ màn phun lửa và phun nước của Cầu Rồng lúc 21 giờ!» "
        + "Màn trình diễn thường lệ diễn ra vào những tối nào?",
      options: ["Mỗi tối trong tuần", "Tối thứ Bảy và Chủ Nhật", "Chỉ đêm Giao thừa", "Tối thứ Hai và thứ Tư"],
      answer: 1,
      hints: [
        "Màn trình diễn dành cho dịp cuối tuần và các ngày lễ lớn.",
        "Hai ngày cuối tuần.",
      ],
      reward: "D",
      fact: "Cầu Rồng phun lửa và phun nước lúc 21 giờ tối thứ Bảy, Chủ Nhật và các dịp lễ lớn.",
    },
    {
      id: "mountains",
      object: "Mô hình núi đá cẩm thạch",
      title: "Mô Hình Ngũ Hành Sơn",
      type: "multi",
      prompt: "Mô hình đá cẩm thạch có năm ngọn núi, mỗi ngọn mang tên một hành. Chọn đủ cả năm tên.",
      options: ["Kim", "Mộc", "Phong", "Thủy", "Hỏa", "Lôi", "Thổ", "Nguyệt"],
      answers: [0, 1, 3, 4, 6],
      hints: [
        "Ngũ hành là năm yếu tố trong triết học phương Đông.",
        "Gió (Phong), sấm (Lôi) và trăng (Nguyệt) không thuộc ngũ hành.",
      ],
      reward: "A",
      fact: "Ngũ Hành Sơn gồm năm ngọn Kim Sơn, Mộc Sơn, Thủy Sơn, Hỏa Sơn và Thổ Sơn, đặt tên theo ngũ hành.",
    },
    {
      id: "plaque",
      object: "Tấm biển đồng kỷ niệm",
      title: "Tấm Biển Đồng",
      type: "code",
      prompt: "Tấm biển đồng có khóa ba vòng số, bên dưới khắc: «Chiều dài của Cầu Rồng, tính bằng mét».",
      answer: "666",
      hints: [
        "Ba chữ số giống hệt nhau.",
        "Lớn hơn 600 và nhỏ hơn 700.",
      ],
      reward: "N",
      fact: "Cầu Rồng dài 666 m, khánh thành ngày 29/3/2013 — đúng dịp kỷ niệm ngày giải phóng Đà Nẵng (29/3/1975).",
    },
    {
      id: "postcard",
      object: "Bưu thiếp trên tủ đầu giường",
      title: "Bưu Thiếp Bà Nà",
      type: "text",
      prompt:
        "Tấm bưu thiếp chụp cây cầu cong vắt ngang sườn núi Bà Nà, được nâng bởi hai bàn tay đá khổng lồ. "
        + "Cây cầu tên là gì?",
      placeholder: "Tên cây cầu…",
      accept: ["Cầu Vàng", "Vàng", "Golden Bridge"],
      hints: [
        "Thân cầu sơn màu ánh kim.",
        "Tên tiếng Anh của nó là «Golden Bridge».",
      ],
      reward: "N",
      fact: "Cầu Vàng trên Bà Nà Hills mở cửa năm 2018 và nổi tiếng khắp thế giới nhờ đôi bàn tay khổng lồ nâng đỡ.",
    },
    {
      id: "frames",
      object: "Bốn khung ảnh treo lệch",
      title: "Bốn Khung Ảnh Cầu",
      type: "order",
      prompt: "Bốn khung ảnh cây cầu treo lệch trên tường. Xếp các cây cầu theo năm khánh thành, từ sớm nhất đến muộn nhất.",
      items: [
        { key: "songhan", label: "Cầu sông Hàn" },
        { key: "thuanphuoc", label: "Cầu Thuận Phước" },
        { key: "rong", label: "Cầu Rồng" },
        { key: "vang", label: "Cầu Vàng" },
      ],
      answer: ["songhan", "thuanphuoc", "rong", "vang"],
      hints: [
        "Cầu quay sông Hàn lâu đời nhất trong bốn cầu, khánh thành năm 2000.",
        "Cầu treo Thuận Phước (2009) có trước Cầu Rồng (2013).",
      ],
      reward: "G",
      fact: "Cầu sông Hàn (2000) là cây cầu quay đầu tiên của Việt Nam; tiếp theo là Cầu Thuận Phước (2009), Cầu Rồng (2013) và Cầu Vàng (2018).",
    },
    {
      id: "tray",
      object: "Khay đồ ăn khuya",
      title: "Khay Đặc Sản",
      type: "match",
      prompt: "Khay đồ ăn khuya lễ tân gửi lên kèm mẩu giấy: «Nối món với cách thưởng thức».",
      pairs: [
        ["Mì Quảng", "Sợi mì vàng, chan xâm xấp nước dùng"],
        ["Bánh tráng cuốn thịt heo", "Cuốn rau sống, chấm mắm nêm"],
        ["Bún chả cá", "Chả cá chiên trong tô bún nước"],
      ],
      hints: [
        "Món «cuốn» thì ăn kèm rau sống.",
        "Mì Quảng nổi tiếng vì chỉ chan một ít nước dùng.",
      ],
      reward: "A",
      fact: "Mì Quảng, bánh tráng cuốn thịt heo chấm mắm nêm và bún chả cá là ba món du khách nên thử khi đến Đà Nẵng.",
    },
  ],
};
