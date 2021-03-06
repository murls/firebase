// PASTE COPIED THINGS HERE

window.projectid = config.projectId;

window.error = "Unknown Shortened URL";
window.found = ""

window.currentURL = window.location.pathname;

document.readyState = stats();

function stats() {
	var askForStats = location.search;
	if (askForStats.includes("stats=yes") === true) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var responses = JSON.parse(this.responseText);
				if (responses.s === 2) {
					currentURL = currentURL.replace(/\//g, "")
					document.getElementById("info").innerText = 'Stats for "' + currentURL + '"'
					document.getElementById("hits").innerText = "Hits: " + responses.th
					document.getElementById("desktop").innerText = "Desktop: " + responses.td
					document.getElementById("mobile").innerText = "Mobile: " + responses.tm
					document.getElementById("long").innerText = "Long URL: " + responses.l
					document.getElementById("info-2").innerText = "To see more stats, please login."
				}
			}
			else {
				document.getElementById("info").innerText = error;
			}
		};
		xmlhttp.open("GET", "https://" + projectid + ".firebaseio.com/urls" + currentURL + '.json', true);
		xmlhttp.send();
	}
	else {
		get();
	}
}

function get() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var responses = JSON.parse(this.responseText);
			if (responses.s === 2) {
				window.longURL = responses.l;
				document.getElementById("info").innerText = found;
				hits();
			}
		}
		else {
			document.getElementById("info").innerText = error;
		}
	};
	xmlhttp.open("GET", "https://" + projectid + ".firebaseio.com/urls" + currentURL + ".json", true);
	xmlhttp.send();
}

function hits() {
	var dt = new Date();
	var m = String(dt.getUTCMonth() + 1);
	var d = String(dt.getUTCDate());
	var y = String(dt.getFullYear());
	var x = d + "-" + m + "-" + y;
	var th = firebase.database().ref('urls' + currentURL + '/th');
	th.transaction(function(h) {
		return (h || 0) + 1;
	});
	var h = firebase.database().ref('urls' + currentURL + '/h/' + x);
	h.transaction(function(h) {
		return (h || 0) + 1;
	});
	var le = firebase.database().ref().child('urls' + currentURL + '/le');
	le.remove();
	le.set({
		le: x
	})
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|Pixel|IEMobile|Windows Phone|Kindle|Silk|Mobile|Firefox OS|Opera Mini/i
		.test(navigator.userAgent)) {
		var tm = firebase.database().ref('urls' + currentURL + '/tm');
		tm.transaction(function(m) {
			return (m || 0) + 1;
		});
		var m = firebase.database().ref('urls' + currentURL + '/m/' + x);
		m.transaction(function(m) {
			return (m || 0) + 1;
		});
	}
	else {
		var td = firebase.database().ref('urls' + currentURL + '/td');
		td.transaction(function(d) {
			return (d || 0) + 1;
		});
		var d = firebase.database().ref('urls' + currentURL + '/d/' + x);
		d.transaction(function(d) {
			return (d || 0) + 1;
		});
	}
	referrer();
}

function referrer() {
	var ref = document.referrer;
	if (ref === "") {
		var u = firebase.database().ref('urls' + currentURL + '/r/VW5rbm93bg==')
		u.transaction(function(u) {
			return (u || 0) + 1;
		});
		platform();
	}
	else {
		ref = ref.replace(/https:\/\//g, '')
		ref = ref.replace(/http:\/\//g, '')
		ref = ref.split('/')[0]
		ref = window.btoa(ref);
		var e = firebase.database().ref('urls' + currentURL + '/r/' + ref)
		e.transaction(function(e) {
			return (e || 0) + 1;
		});
		platform();
	}
}

function platform() {
	var plat = navigator.platform;
	if (plat === "") {
		var pu = firebase.database().ref('urls' + currentURL + '/p/u')
		pu.transaction(function(pu) {
			return (pu || 0) + 1;
		})
		ip();
	}
	else {
		var p = firebase.database().ref('urls' + currentURL + '/p/' + plat)
		p.transaction(function(p) {
			return (p || 0) + 1;
		})
		ip();
	}
}

function ip() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var ip = geoplugin_countryCode();
			var i = firebase.database().ref('urls' + currentURL + '/c/' + ip)
			i.transaction(function(i) {
				return (i || 0) + 1;
			})
			rdr('go')
		}
	};
	xmlhttp.open("GET", "http://www.geoplugin.net/", true);
	xmlhttp.send();
}

function rdr(s) {
	if (s === 'go') {
		setTimeout(function() {
			document.location = longURL;
		}, 300);
	}
	else {
		document.getElementById("info").innerText = error;
	}
}
