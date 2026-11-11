$(function () {
  var songs = [
    { id: 1, title: "The Less I Know the Better", artist: "Tame Impala", album: "Currents", genre: "Psychedelic Pop", year: 2015 },
    { id: 2, title: "Let It Happen", artist: "Tame Impala", album: "Currents", genre: "Psychedelic Pop", year: 2015 },
    { id: 3, title: "good 4 u", artist: "Olivia Rodrigo", album: "SOUR", genre: "Pop Rock", year: 2021 },
    { id: 4, title: "drivers license", artist: "Olivia Rodrigo", album: "SOUR", genre: "Pop Rock", year: 2021 },
    { id: 5, title: "Bad Romance", artist: "Lady Gaga", album: "The Fame Monster", genre: "Pop", year: 2009 },
    { id: 6, title: "Alejandro", artist: "Lady Gaga", album: "The Fame Monster", genre: "Pop", year: 2009 },
    { id: 7, title: "Billie Jean", artist: "Michael Jackson", album: "Thriller", genre: "Pop", year: 1982 },
    { id: 8, title: "Beat It", artist: "Michael Jackson", album: "Thriller", genre: "Pop", year: 1982 },
    { id: 9, title: "Stronger", artist: "Kanye West", album: "Graduation", genre: "Hip-Hop", year: 2007 },
    { id: 10, title: "Good Life", artist: "Kanye West", album: "Graduation", genre: "Hip-Hop", year: 2007 },
    { id: 11, title: "EARFQUAKE", artist: "Tyler, the Creator", album: "IGOR", genre: "Hip-Hop", year: 2019 },
    { id: 12, title: "NEW MAGIC WAND", artist: "Tyler, the Creator", album: "IGOR", genre: "Hip-Hop", year: 2019 }
  ];
  var nextId = 13;
  var activeGenre = "all";
  var songModal = new bootstrap.Modal($("#songModal")[0]);
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function esc(text) {
    return $("<div>").text(text).html();
  }

  function mark(selector, valid, message) {
    var $field = $(selector);
    $field.toggleClass("is-valid", valid).toggleClass("is-invalid", !valid);
    if (!valid && message) {
      $field.siblings(".invalid-feedback").text("\u2716 " + message);
    }
    return valid;
  }

  function findSong(id) {
    return $.grep(songs, function (song) {
      return song.id === id;
    })[0];
  }

  function renderTable() {
    var term = $.trim($("#searchInput").val()).toLowerCase();
    var rows = "";
    var count = 0;
    $.each(songs, function (i, song) {
      var text = (song.title + " " + song.artist + " " + song.album).toLowerCase();
      var matchSearch = text.indexOf(term) !== -1;
      var matchGenre = activeGenre === "all" || song.genre === activeGenre;
      if (!matchSearch || !matchGenre) {
        return;
      }
      count++;
      rows += "<tr>" +
        "<td>" + count + "</td>" +
        "<td>" + esc(song.title) + "</td>" +
        "<td>" + esc(song.artist) + "</td>" +
        "<td>" + esc(song.album) + "</td>" +
        "<td>" + esc(song.genre) + "</td>" +
        "<td>" + song.year + "</td>" +
        '<td class="actions">' +
        '<button type="button" class="btn btn-sm btn-outline-light edit-btn" data-id="' + song.id + '">Edit</button> ' +
        '<button type="button" class="btn btn-sm btn-outline-danger delete-btn" data-id="' + song.id + '">Delete</button>' +
        "</td></tr>";
    });
    $("#songBody").html(rows);
    $("#noResults").toggle(count === 0);
  }

  $("#searchInput").on("input", renderTable);

  $("#filterRow").on("click", ".filter-btn", function () {
    activeGenre = $(this).data("genre");
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");
    renderTable();
  });

  $("#addBtn").on("click", function () {
    $("#songForm")[0].reset();
    $("#songId").val("");
    $("#songForm .form-control").removeClass("is-valid is-invalid");
    $("#modalTitle").text("Add song");
    songModal.show();
  });

  $("#songBody").on("click", ".edit-btn", function () {
    var song = findSong($(this).data("id"));
    $("#songForm .form-control").removeClass("is-valid is-invalid");
    $("#songId").val(song.id);
    $("#songTitle").val(song.title);
    $("#songArtist").val(song.artist);
    $("#songAlbum").val(song.album);
    $("#songGenre").val(song.genre);
    $("#songYear").val(song.year);
    $("#modalTitle").text("Edit song");
    songModal.show();
  });

  $("#songBody").on("click", ".delete-btn", function () {
    var song = findSong($(this).data("id"));
    if (confirm('Delete "' + song.title + '"?')) {
      songs = $.grep(songs, function (item) {
        return item.id !== song.id;
      });
      renderTable();
    }
  });

  $("#songForm").on("submit", function (e) {
    e.preventDefault();
    var year = parseInt($("#songYear").val(), 10);
    var results = [
      mark("#songTitle", $.trim($("#songTitle").val()) !== ""),
      mark("#songArtist", $.trim($("#songArtist").val()) !== ""),
      mark("#songAlbum", $.trim($("#songAlbum").val()) !== ""),
      mark("#songYear", year >= 1900 && year <= new Date().getFullYear())
    ];
    if ($.inArray(false, results) !== -1) {
      return;
    }
    var data = {
      title: $.trim($("#songTitle").val()),
      artist: $.trim($("#songArtist").val()),
      album: $.trim($("#songAlbum").val()),
      genre: $("#songGenre").val(),
      year: year
    };
    var id = $("#songId").val();
    if (id) {
      $.extend(findSong(parseInt(id, 10)), data);
    } else {
      data.id = nextId++;
      songs.push(data);
    }
    songModal.hide();
    renderTable();
  });

  function showAlert(type, message) {
    $("#formAlert").html('<div class="alert alert-' + type + '" role="alert">' + message + "</div>");
  }

  function updateStrength(password) {
    var $bar = $("#strengthBar");
    var $text = $("#strengthText");
    var levels = [
      { name: "Weak", bar: "w-25 bg-danger", text: "text-danger" },
      { name: "Medium", bar: "w-50 bg-warning", text: "text-warning" },
      { name: "Strong", bar: "w-100 bg-success", text: "text-success" }
    ];
    $bar.removeClass("w-25 w-50 w-100 bg-danger bg-warning bg-success");
    $text.removeClass("text-danger text-warning text-success");
    if (password === "") {
      $text.text("Password strength");
      return;
    }
    var score = 0;
    if (password.length >= 8) { score++; }
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) { score++; }
    if (/\d/.test(password)) { score++; }
    if (/[^A-Za-z0-9]/.test(password)) { score++; }
    var level = levels[score <= 1 ? 0 : score <= 3 ? 1 : 2];
    $bar.addClass(level.bar);
    $text.addClass(level.text).text(level.name + " password");
  }

  function checkName() {
    var value = $.trim($("#regName").val());
    if (value === "") { return mark("#regName", false, "Name is required"); }
    if (value.length < 2) { return mark("#regName", false, "Name must have at least 2 characters"); }
    return mark("#regName", true);
  }

  function checkEmail() {
    var value = $.trim($("#regEmail").val());
    if (value === "") { return mark("#regEmail", false, "Email is required"); }
    if (!emailPattern.test(value)) { return mark("#regEmail", false, "Enter a valid email, for example name@mail.com"); }
    return mark("#regEmail", true);
  }

  function checkPassword() {
    var value = $("#regPassword").val();
    updateStrength(value);
    if (value === "") { return mark("#regPassword", false, "Password is required"); }
    if (value.length < 6) { return mark("#regPassword", false, "Password must have at least 6 characters"); }
    return mark("#regPassword", true);
  }

  function checkConfirm() {
    var value = $("#regConfirm").val();
    if (value === "") { return mark("#regConfirm", false, "Please confirm your password"); }
    if (value !== $("#regPassword").val()) { return mark("#regConfirm", false, "Passwords do not match"); }
    return mark("#regConfirm", true);
  }

  $("#regName").on("input", checkName);
  $("#regEmail").on("input", checkEmail);
  $("#regPassword").on("input", function () {
    checkPassword();
    if ($("#regConfirm").val() !== "") {
      checkConfirm();
    }
  });
  $("#regConfirm").on("input", checkConfirm);

  $("#registerForm").on("submit", function (e) {
    e.preventDefault();
    var results = [checkName(), checkEmail(), checkPassword(), checkConfirm()];
    if ($.inArray(false, results) !== -1) {
      showAlert("danger", "Please fix the errors above and try again.");
      return;
    }
    showAlert("success", "Registration successful! Welcome to WaveList, " + esc($.trim($("#regName").val())) + ".");
    this.reset();
    $("#registerForm .form-control").removeClass("is-valid is-invalid");
    updateStrength("");
  });

  var $items = $(".gallery-item");
  var current = 0;

  function fillLightbox($link) {
    $("#lbImage").attr("src", $link.attr("href")).attr("alt", $link.data("caption"));
    $("#lbCaption").text($link.data("caption"));
  }

  function showImage(index) {
    current = (index + $items.length) % $items.length;
    $("#lbImage").animate({ opacity: 0 }, 150, function () {
      fillLightbox($items.eq(current));
      $(this).animate({ opacity: 1 }, 250);
    });
  }

  function closeLightbox() {
    $("#lightbox").fadeOut(300);
  }

  $items.on("click", function (e) {
    e.preventDefault();
    current = $items.index(this);
    fillLightbox($(this));
    $("#lbImage").css("opacity", 1);
    $("#lightbox").fadeIn(300);
  });

  $("#lbNext").on("click", function () { showImage(current + 1); });
  $("#lbPrev").on("click", function () { showImage(current - 1); });
  $("#lbClose").on("click", closeLightbox);

  $("#lightbox").on("click", function (e) {
    if (e.target === this) {
      closeLightbox();
    }
  });

  $(document).on("keydown", function (e) {
    if (!$("#lightbox").is(":visible")) {
      return;
    }
    if (e.key === "Escape") { closeLightbox(); }
    if (e.key === "ArrowRight") { showImage(current + 1); }
    if (e.key === "ArrowLeft") { showImage(current - 1); }
  });

    var albumCategory = "all";

  function filterAlbums() {
    var term = $.trim($("#albumSearch").val()).toLowerCase();
    var count = 0;
    $(".album-grid .card-box").each(function () {
      var $card = $(this);
      var matchText = $card.text().toLowerCase().indexOf(term) !== -1;
      var matchGenre = albumCategory === "all" || $card.data("genre") === albumCategory;
      var show = matchText && matchGenre;
      $card.toggle(show);
      if (show) { count++; }
    });
    $("#noAlbums").toggle(count === 0);
  }

  $("#albumSearch").on("input", filterAlbums);

  $(".filter-buttons").on("click", ".btn-filter", function () {
    albumCategory = $(this).data("category");
    $(".btn-filter").removeClass("active");
    $(this).addClass("active");
    filterAlbums();
  });

  renderTable();
});
