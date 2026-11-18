/**
 * WaveList - Music Playlist Web Application
 * Core JavaScript & jQuery Module
 */

// -------------------------------------------------------------
// 1. Theme Toggle & State Persistence (localStorage)
// -------------------------------------------------------------
(function initTheme() {
  var savedTheme = localStorage.getItem("wavelist_theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  document.documentElement.setAttribute("data-bs-theme", savedTheme);
})();

$(function () {
  // Update Theme Toggle Button UI
  function updateThemeButton() {
    var currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    var $btn = $("#themeToggle");
    if (currentTheme === "dark") {
      $btn.html('<span>🌙</span> Dark');
      $btn.attr("aria-label", "Switch to light theme");
    } else {
      $btn.html('<span>☀️</span> Light');
      $btn.attr("aria-label", "Switch to dark theme");
    }
  }

  updateThemeButton();

  $("#themeToggle").on("click", function () {
    var currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    var newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    document.documentElement.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("wavelist_theme", newTheme);
    updateThemeButton();
  });

  // -----------------------------------------------------------
  // 2. Authentication & Sign-in State (localStorage)
  // -----------------------------------------------------------
  function getCurrentUser() {
    try {
      var data = localStorage.getItem("wavelist_user");
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function setCurrentUser(user) {
    localStorage.setItem("wavelist_user", JSON.stringify(user));
    updateAuthUI();
  }

  function signOutUser() {
    localStorage.removeItem("wavelist_user");
    updateAuthUI();
    if ($("#profileSection").length) {
      $("#profileSection").hide();
      $("#authFormsSection").fadeIn();
    }
  }

  function updateAuthUI() {
    var user = getCurrentUser();
    var $container = $("#authContainer");
    if ($container.length === 0) return;

    if (user && user.email) {
      var displayName = user.name || user.email.split("@")[0];
      $container.html(
        '<div class="auth-user-badge">' +
          '<span class="user-icon">&#128100;</span> ' +
          '<span>' + $("<div>").text(displayName).html() + "</span>" +
        "</div>" +
        '<button type="button" class="btn-signout" id="navSignOutBtn" title="Sign out of account">Sign Out</button>'
      );
    } else {
      $container.html(
        '<a href="signin.html" class="btn btn-sm btn-music-outline">Sign In</a>'
      );
    }
  }

  updateAuthUI();

  $(document).on("click", "#navSignOutBtn, #pageSignOutBtn", function (e) {
    e.preventDefault();
    signOutUser();
  });

  // Sign-in and Registration on signin.html
  if ($("#signInForm").length || $("#registerForm").length) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function showAuthAlert(type, message) {
      $("#authAlert").html(
        '<div class="alert alert-' + type + ' alert-dismissible fade show" role="alert">' +
          message +
          '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
        '</div>'
      );
    }

    // Toggle between Sign In and Register tabs
    $(".form-tab-btn").on("click", function () {
      var target = $(this).data("tab");
      $(".form-tab-btn").removeClass("active");
      $(this).addClass("active");
      $(".auth-tab-pane").hide();
      $("#" + target).fadeIn(200);
      $("#authAlert").empty();
    });

    // Check if user is already signed in
    var activeUser = getCurrentUser();
    if (activeUser && activeUser.email) {
      $("#authFormsSection").hide();
      $("#profileSection").show();
      $("#profileName").text(activeUser.name || "Music Lover");
      $("#profileEmail").text(activeUser.email);
      $("#profileDate").text(activeUser.loginDate || "Recently");
    }

    // Sign In Submission
    $("#signInForm").on("submit", function (e) {
      e.preventDefault();
      var email = $.trim($("#loginEmail").val());
      var password = $("#loginPassword").val();
      var valid = true;

      if (!email || !emailRegex.test(email)) {
        $("#loginEmail").addClass("is-invalid").siblings(".invalid-feedback").text("Please enter a valid email address.");
        valid = false;
      } else {
        $("#loginEmail").removeClass("is-invalid").addClass("is-valid");
      }

      if (!password || password.length < 6) {
        $("#loginPassword").addClass("is-invalid").siblings(".invalid-feedback").text("Password must be at least 6 characters.");
        valid = false;
      } else {
        $("#loginPassword").removeClass("is-invalid").addClass("is-valid");
      }

      if (!valid) return;

      var registeredUsers = [];
      try {
        registeredUsers = JSON.parse(localStorage.getItem("wavelist_registered_users")) || [];
      } catch (err) {
        registeredUsers = [];
      }

      var foundUser = $.grep(registeredUsers, function (u) {
        return u.email.toLowerCase() === email.toLowerCase();
      })[0];

      var userName = foundUser ? foundUser.name : email.split("@")[0];

      var sessionUser = {
        name: userName,
        email: email,
        loginDate: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setCurrentUser(sessionUser);
      showAuthAlert("success", "Welcome back, " + $("<div>").text(sessionUser.name).html() + "! You are signed in.");

      setTimeout(function () {
        $("#authFormsSection").fadeOut(200, function () {
          $("#profileSection").fadeIn();
          $("#profileName").text(sessionUser.name);
          $("#profileEmail").text(sessionUser.email);
          $("#profileDate").text(sessionUser.loginDate);
        });
      }, 500);
    });

    // Password strength indicator
    function checkStrength(password) {
      var $bar = $("#strengthBar");
      var $text = $("#strengthText");
      var levels = [
        { name: "Weak", bar: "w-25 bg-danger", text: "text-danger" },
        { name: "Medium", bar: "w-50 bg-warning", text: "text-warning" },
        { name: "Strong", bar: "w-100 bg-success", text: "text-success" }
      ];
      $bar.removeClass("w-25 w-50 w-100 bg-danger bg-warning bg-success");
      $text.removeClass("text-danger text-warning text-success");
      if (!password) {
        $text.text("Password strength");
        return;
      }
      var score = 0;
      if (password.length >= 8) score++;
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
      if (/\d/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;
      var lvl = levels[score <= 1 ? 0 : score <= 3 ? 1 : 2];
      $bar.addClass(lvl.bar);
      $text.addClass(lvl.text).text(lvl.name + " password");
    }

    $("#regPassword").on("input", function () {
      checkStrength($(this).val());
    });

    // Registration Submission
    $("#registerForm").on("submit", function (e) {
      e.preventDefault();
      var name = $.trim($("#regName").val());
      var email = $.trim($("#regEmail").val());
      var password = $("#regPassword").val();
      var confirm = $("#regConfirm").val();
      var valid = true;

      if (!name || name.length < 2) {
        $("#regName").addClass("is-invalid").siblings(".invalid-feedback").text("Name must be at least 2 characters.");
        valid = false;
      } else {
        $("#regName").removeClass("is-invalid").addClass("is-valid");
      }

      if (!email || !emailRegex.test(email)) {
        $("#regEmail").addClass("is-invalid").siblings(".invalid-feedback").text("Please enter a valid email address.");
        valid = false;
      } else {
        $("#regEmail").removeClass("is-invalid").addClass("is-valid");
      }

      if (!password || password.length < 6) {
        $("#regPassword").addClass("is-invalid").siblings(".invalid-feedback").text("Password must be at least 6 characters.");
        valid = false;
      } else {
        $("#regPassword").removeClass("is-invalid").addClass("is-valid");
      }

      if (!confirm || confirm !== password) {
        $("#regConfirm").addClass("is-invalid").siblings(".invalid-feedback").text("Passwords do not match.");
        valid = false;
      } else {
        $("#regConfirm").removeClass("is-invalid").addClass("is-valid");
      }

      if (!valid) return;

      var registeredUsers = [];
      try {
        registeredUsers = JSON.parse(localStorage.getItem("wavelist_registered_users")) || [];
      } catch (err) {
        registeredUsers = [];
      }

      var newUser = {
        name: name,
        email: email,
        password: password
      };
      registeredUsers.push(newUser);
      localStorage.setItem("wavelist_registered_users", JSON.stringify(registeredUsers));

      var sessionUser = {
        name: name,
        email: email,
        loginDate: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setCurrentUser(sessionUser);

      showAuthAlert("success", "Account created successfully! Welcome, " + $("<div>").text(name).html() + ".");
      this.reset();
      $("#registerForm .form-control").removeClass("is-valid is-invalid");
      checkStrength("");

      setTimeout(function () {
        $("#authFormsSection").fadeOut(200, function () {
          $("#profileSection").fadeIn();
          $("#profileName").text(sessionUser.name);
          $("#profileEmail").text(sessionUser.email);
          $("#profileDate").text(sessionUser.loginDate);
        });
      }, 600);
    });
  }

  // -----------------------------------------------------------
  // 3. jQuery FAQ Accordion with .slideToggle() & (+ / -) indicator
  // -----------------------------------------------------------
  if ($(".faq-question").length) {
    $(".faq-question").on("click", function () {
      var $question = $(this);
      var $answer = $question.next(".faq-answer");
      var $icon = $question.find(".faq-icon");

      // Slide toggle with smooth jQuery animation
      $answer.slideToggle(300, function () {
        if ($(this).is(":visible")) {
          $icon.text("\u2212"); // Minus sign
          $question.attr("aria-expanded", "true");
        } else {
          $icon.text("+");      // Plus sign
          $question.attr("aria-expanded", "false");
        }
      });
    });
  }

  // -----------------------------------------------------------
  // 4. API Integration (iTunes Search API with fetch())
  // -----------------------------------------------------------
  if ($("#apiResultsGrid").length) {
    var lastApiData = [];
    var lastApiQuery = "The Weeknd";

    function setApiStatus(state, text) {
      $("#apiStatus")
        .removeClass("bg-success bg-warning bg-danger text-dark status-error status-loading")
        .addClass(state === "ok" ? "bg-success" : state === "error" ? "bg-danger status-error" : "bg-warning text-dark status-loading")
        .text(text);
    }

    function searchMusicApi(term, filterGenre) {
      var query = $.trim(term);
      if (!query) {
        query = "pop";
      }
      lastApiQuery = query;
      setApiStatus("loading", "API Status: Loading\u2026");

      $("#apiLoading").show();
      $("#apiError").hide();
      $("#apiEmpty").hide();
      $("#apiResultsGrid").empty();

      var apiUrl = "https://itunes.apple.com/search?term=" + encodeURIComponent(query) + "&entity=song&limit=24";

      fetch(apiUrl)
        .then(function (response) {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status + ": Failed to retrieve data from Music API.");
          }
          return response.json();
        })
        .then(function (data) {
          $("#apiLoading").hide();
          if (!data || !data.results || data.results.length === 0) {
            lastApiData = [];
            setApiStatus("ok", "API Status: Connected (0 results)");
            $("#apiEmpty").show();
            return;
          }
          setApiStatus("ok", "API Status: Live & Connected");
          lastApiData = data.results;
          renderApiCards(lastApiData, filterGenre || "all");
        })
        .catch(function (error) {
          console.error("API Fetch Error:", error);
          $("#apiLoading").hide();
          setApiStatus("error", "API Status: Unavailable");
          $("#apiErrorMsg").text("Could not reach the iTunes API (" + (error.message || "network error") + "). Check your internet connection, disable ad-blockers/VPN and try again.");
          $("#apiError").show();
        });
    }

    function renderApiCards(tracks, genreFilter) {
      var $grid = $("#apiResultsGrid");
      $grid.empty();
      var count = 0;

      $.each(tracks, function (i, item) {
        var trackGenre = item.primaryGenreName || "Music";
        if (genreFilter && genreFilter !== "all" && trackGenre.toLowerCase().indexOf(genreFilter.toLowerCase()) === -1) {
          return;
        }

        count++;
        var artwork = (item.artworkUrl100 || "").replace("100x100bb", "300x300bb");
        var trackTitle = item.trackName || "Unknown Track";
        var artistName = item.artistName || "Unknown Artist";
        var albumName = item.collectionName || "Single";
        var previewAudio = item.previewUrl;

        var cardHtml =
          '<article class="api-card">' +
            '<img src="' + artwork + '" alt="' + $("<div>").text(trackTitle).html() + '" loading="lazy">' +
            '<span class="api-badge">' + $("<div>").text(trackGenre).html() + '</span>' +
            '<h3 class="api-track-name" title="' + $("<div>").text(trackTitle).html() + '">' + $("<div>").text(trackTitle).html() + '</h3>' +
            '<p class="api-artist-name" title="' + $("<div>").text(artistName).html() + '">&#127908; ' + $("<div>").text(artistName).html() + '</p>' +
            '<p class="api-collection-name" title="' + $("<div>").text(albumName).html() + '">&#128191; ' + $("<div>").text(albumName).html() + '</p>';

        if (previewAudio) {
          cardHtml += '<audio class="api-audio" controls preload="none" src="' + previewAudio + '">Your browser does not support audio playback.</audio>';
        } else {
          cardHtml += '<small class="text-muted mt-auto">Audio preview not available</small>';
        }

        cardHtml += '</article>';
        $grid.append(cardHtml);
      });

      if (count === 0) {
        $("#apiEmpty").show();
      } else {
        $("#apiEmpty").hide();
      }
    }

    $("#apiRetryBtn").on("click", function () {
      var genre = $(".api-genre-filter.active").data("genre") || "all";
      searchMusicApi(lastApiQuery, genre);
    });

    // Search submit
    $("#apiSearchForm").on("submit", function (e) {
      e.preventDefault();
      var query = $("#apiSearchInput").val();
      var currentGenre = $(".api-genre-filter.active").data("genre") || "all";
      searchMusicApi(query, currentGenre);
    });

    // Genre filter buttons
    $(".api-genre-filter").on("click", function () {
      $(".api-genre-filter").removeClass("active");
      $(this).addClass("active");
      var genre = $(this).data("genre");
      if (lastApiData.length > 0) {
        renderApiCards(lastApiData, genre);
      } else {
        var query = $("#apiSearchInput").val() || genre;
        searchMusicApi(query, genre);
      }
    });

    // Quick discovery buttons
    $(".api-quick-btn").on("click", function () {
      var query = $(this).data("query");
      $("#apiSearchInput").val(query);
      $(".api-genre-filter").removeClass("active");
      $('.api-genre-filter[data-genre="all"]').addClass("active");
      searchMusicApi(query, "all");
    });

    // Initial default search
    searchMusicApi("The Weeknd", "all");
  }

  // -----------------------------------------------------------
  // 5. Songs Page CRUD & Table Management (songs.html)
  // -----------------------------------------------------------
  if ($("#songTable").length) {
    var defaultSongs = [
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

    function loadSongs() {
      try {
        var stored = localStorage.getItem("wavelist_songs");
        return stored ? JSON.parse(stored) : defaultSongs;
      } catch (e) {
        return defaultSongs;
      }
    }

    function saveSongs(songsArray) {
      localStorage.setItem("wavelist_songs", JSON.stringify(songsArray));
    }

    var songs = loadSongs();
    var activeGenre = "all";
    var songModal = new bootstrap.Modal($("#songModal")[0]);

    function esc(text) {
      return $("<div>").text(text).html();
    }

    function mark(selector, valid) {
      var $f = $(selector);
      $f.toggleClass("is-valid", valid).toggleClass("is-invalid", !valid);
      return valid;
    }

    function findSong(id) {
      return $.grep(songs, function (s) { return s.id === id; })[0];
    }

    function renderSongsTable() {
      var term = $.trim($("#searchInput").val()).toLowerCase();
      var rows = "";
      var count = 0;

      $.each(songs, function (i, song) {
        var text = (song.title + " " + song.artist + " " + song.album).toLowerCase();
        var matchSearch = text.indexOf(term) !== -1;
        var matchGenre = activeGenre === "all" || song.genre === activeGenre;
        if (!matchSearch || !matchGenre) return;

        count++;
        rows += "<tr>" +
          "<td>" + count + "</td>" +
          "<td><strong>" + esc(song.title) + "</strong></td>" +
          "<td>" + esc(song.artist) + "</td>" +
          "<td>" + esc(song.album) + "</td>" +
          "<td><span class=\"badge bg-secondary\">" + esc(song.genre) + "</span></td>" +
          "<td>" + song.year + "</td>" +
          '<td class="actions">' +
            '<button type="button" class="btn btn-sm btn-outline-light edit-btn me-1" data-id="' + song.id + '">&#9998; Edit</button>' +
            '<button type="button" class="btn btn-sm btn-outline-danger delete-btn" data-id="' + song.id + '">&#128465; Delete</button>' +
          "</td></tr>";
      });

      $("#songBody").html(rows);
      $("#noResults").toggle(count === 0);
    }

    $("#searchInput").on("input", renderSongsTable);

    $("#filterRow").on("click", ".filter-btn", function () {
      activeGenre = $(this).data("genre");
      $(".filter-btn").removeClass("active");
      $(this).addClass("active");
      renderSongsTable();
    });

    $("#addBtn").on("click", function () {
      $("#songForm")[0].reset();
      $("#songId").val("");
      $("#songForm .form-control").removeClass("is-valid is-invalid");
      $("#modalTitle").text("Add Song to Playlist");
      songModal.show();
    });

    $("#songBody").on("click", ".edit-btn", function () {
      var song = findSong(parseInt($(this).data("id"), 10));
      if (!song) return;
      $("#songForm .form-control").removeClass("is-valid is-invalid");
      $("#songId").val(song.id);
      $("#songTitle").val(song.title);
      $("#songArtist").val(song.artist);
      $("#songAlbum").val(song.album);
      $("#songGenre").val(song.genre);
      $("#songYear").val(song.year);
      $("#modalTitle").text("Edit Song");
      songModal.show();
    });

    $("#songBody").on("click", ".delete-btn", function () {
      var song = findSong(parseInt($(this).data("id"), 10));
      if (!song) return;
      if (confirm('Are you sure you want to delete "' + song.title + '"?')) {
        songs = $.grep(songs, function (item) {
          return item.id !== song.id;
        });
        saveSongs(songs);
        renderSongsTable();
      }
    });

    $("#songForm").on("submit", function (e) {
      e.preventDefault();
      var year = parseInt($("#songYear").val(), 10);
      var currentYear = new Date().getFullYear();
      var results = [
        mark("#songTitle", $.trim($("#songTitle").val()) !== ""),
        mark("#songArtist", $.trim($("#songArtist").val()) !== ""),
        mark("#songAlbum", $.trim($("#songAlbum").val()) !== ""),
        mark("#songYear", year >= 1900 && year <= currentYear + 1)
      ];

      if ($.inArray(false, results) !== -1) return;

      var songData = {
        title: $.trim($("#songTitle").val()),
        artist: $.trim($("#songArtist").val()),
        album: $.trim($("#songAlbum").val()),
        genre: $("#songGenre").val(),
        year: year
      };

      var id = $("#songId").val();
      if (id) {
        var existing = findSong(parseInt(id, 10));
        if (existing) $.extend(existing, songData);
      } else {
        var maxId = 0;
        $.each(songs, function (i, s) { if (s.id > maxId) maxId = s.id; });
        songData.id = maxId + 1;
        songs.push(songData);
      }

      saveSongs(songs);
      songModal.hide();
      renderSongsTable();
    });

    renderSongsTable();
  }

  // -----------------------------------------------------------
  // 6. Albums Filtering (albums.html)
  // -----------------------------------------------------------
  if ($("#albumSearch").length) {
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
        if (show) count++;
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
  }

  // -----------------------------------------------------------
  // 7. Lightbox Image Gallery (artists.html)
  // -----------------------------------------------------------
  if ($(".gallery-item").length) {
    var $items = $(".gallery-item");
    var currentLbIndex = 0;

    function fillLightbox($link) {
      $("#lbImage").attr("src", $link.attr("href")).attr("alt", $link.data("caption"));
      $("#lbCaption").text($link.data("caption"));
    }

    function showImage(index) {
      currentLbIndex = (index + $items.length) % $items.length;
      $("#lbImage").animate({ opacity: 0 }, 150, function () {
        fillLightbox($items.eq(currentLbIndex));
        $(this).animate({ opacity: 1 }, 200);
      });
    }

    function closeLightbox() {
      $("#lightbox").fadeOut(250);
    }

    $items.on("click", function (e) {
      e.preventDefault();
      currentLbIndex = $items.index(this);
      fillLightbox($(this));
      $("#lbImage").css("opacity", 1);
      $("#lightbox").fadeIn(250);
    });

    $("#lbNext").on("click", function () { showImage(currentLbIndex + 1); });
    $("#lbPrev").on("click", function () { showImage(currentLbIndex - 1); });
    $("#lbClose").on("click", closeLightbox);

    $("#lightbox").on("click", function (e) {
      if (e.target === this) closeLightbox();
    });

    $(document).on("keydown", function (e) {
      if (!$("#lightbox").is(":visible")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showImage(currentLbIndex + 1);
      if (e.key === "ArrowLeft") showImage(currentLbIndex - 1);
    });
  }

  // -----------------------------------------------------------
  // 8. Contact Form Handling (contact.html)
  // -----------------------------------------------------------
  if ($("#contactForm").length) {
    $("#contactForm").on("submit", function (e) {
      e.preventDefault();
      var name = $.trim($("#name").val());
      var email = $.trim($("#email").val());
      var message = $.trim($("#message").val());

      if (!name || !email || !message) {
        alert("Please fill in all required fields.");
        return;
      }

      $("#contactSuccess").removeClass("d-none");
      this.reset();
      setTimeout(function () {
        $("#contactSuccess").addClass("d-none");
      }, 5000);
    });
  }
});
