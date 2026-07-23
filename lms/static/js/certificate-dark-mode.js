(function() {
	var root = document.documentElement;
	var ua = window.navigator.userAgent || "";
	var isAndroidWebView = /Android/i.test(ua) && (/\bwv\b/i.test(ua) || /Version\/[\d.]+.*Chrome/i.test(ua));
	var isIOS = /iPad|iPhone|iPod/.test(ua) || (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
	var isIOSWebView = isIOS && /AppleWebKit/i.test(ua) && !/(Safari|CriOS|FxiOS|EdgiOS|OPiOS)/i.test(ua);
	var isSherabAppWebView = /(^|[\s/])(Sherab|OpenEdX)\//i.test(ua) || /org\.(sherab|openedx)\.app/i.test(ua);

	root.className += " sherab-default-certificate-page";
	if (isAndroidWebView || isIOSWebView || isSherabAppWebView) {
		root.className += " sherab-cert-mobile-webview";
	}
	if (isAndroidWebView) {
		root.className += " sherab-cert-android-webview";
	}
	if (isIOSWebView || (isSherabAppWebView && !/Android/i.test(ua))) {
		root.className += " sherab-cert-ios-webview";
	}

	function lockDefaultCertificateLight() {
		var isMobileWebView = root.className.indexOf("sherab-cert-mobile-webview") !== -1;
		var isIOSAppWebView = root.className.indexOf("sherab-cert-ios-webview") !== -1;
		var isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
		if (!isMobileWebView || !isDarkMode) {
			return;
		}

		var style = document.getElementById("sherab-default-cert-light-lock");
		if (!style) {
			style = document.createElement("style");
			style.id = "sherab-default-cert-light-lock";
			style.type = "text/css";
			document.head.appendChild(style);
		}

		style.textContent = [
			"html.sherab-cert-mobile-webview .sherab-themed-certificate .cert-container,",
			"html.sherab-cert-mobile-webview .sherab-themed-certificate .cert-container * {",
			"  color-scheme: only light !important;",
			"  forced-color-adjust: none !important;",
			"}",
			"html.sherab-cert-mobile-webview .sherab-themed-certificate .cert-container {",
			"  filter: " + (isIOSAppWebView ? "invert(100%) hue-rotate(180deg)" : "none") + " !important;",
			"  background-color: #fff !important;",
			"}",
			"html.sherab-cert-mobile-webview .sherab-themed-certificate .cert-left {",
			"  background-color: #F36F2A !important;",
			"}",
			"html.sherab-cert-mobile-webview .sherab-themed-certificate .cert-right {",
			"  background-color: #fff !important;",
			"}",
			"html.sherab-cert-mobile-webview .sherab-themed-certificate .cert-side-art,",
			"html.sherab-cert-mobile-webview .sherab-themed-certificate .cert-logo,",
			"html.sherab-cert-mobile-webview .sherab-themed-certificate .signatory-img {",
			"  filter: none !important;",
			"}",
			"html.sherab-cert-mobile-webview .sherab-themed-certificate .cert-left-logo {",
			"  filter: brightness(0) invert(1) !important;",
			"}"
		].join("\n");

		isolateAndroidCertificateContainer();
	}

	function isolateAndroidCertificateContainer() {
		var isAndroidAppWebView = root.className.indexOf("sherab-cert-android-webview") !== -1;
		var isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
		if (!isAndroidAppWebView || !isDarkMode || document.getElementById("sherab-default-cert-android-frame")) {
			return;
		}

		var certificate = document.querySelector(".sherab-themed-certificate > .cert-container");
		if (!certificate) {
			return;
		}

		var frame = document.createElement("iframe");
		frame.id = "sherab-default-cert-android-frame";
		frame.className = "sherab-default-cert-android-frame";
		frame.title = "Certificate";
		frame.setAttribute("scrolling", "no");
		certificate.parentNode.insertBefore(frame, certificate);

		var stylesheets = Array.prototype.map.call(
			document.querySelectorAll('link[rel="stylesheet"]'),
			function(link) {
				return '<link rel="stylesheet" href="' + link.href.replace(/"/g, "&quot;") + '">';
			}
		).join("");

		var lightLockCss = [
			"html, body { margin: 0 !important; padding: 0 !important; background: transparent !important; color-scheme: only light !important; overflow: hidden !important; }",
			"body { display: flex; justify-content: center; align-items: flex-start; }",
			".certificate-custom { padding: 0 !important; background: transparent !important; overflow: visible !important; }",
			".cert-container, .cert-container * { color-scheme: only light !important; forced-color-adjust: none !important; }",
			".cert-container, .cert-right { background-color: #fff !important; }",
			".cert-left { background-color: #F36F2A !important; }",
			".cert-container, .cert-side-art, .cert-logo, .signatory-img { filter: none !important; }",
			".cert-left-logo { filter: brightness(0) invert(1) !important; }"
		].join("\n");

		var doc = frame.contentDocument || frame.contentWindow.document;
		doc.open();
		doc.write([
			'<!doctype html>',
			'<html class="sherab-certificate-frame-light">',
			'<head>',
			'<meta charset="utf-8">',
			'<meta name="viewport" content="width=device-width, initial-scale=1">',
			'<meta name="color-scheme" content="light">',
			'<base href="' + document.baseURI.replace(/"/g, "&quot;") + '">',
			stylesheets,
			'<style>' + lightLockCss + '</style>',
			'</head>',
			'<body>',
			'<main class="certificate-custom sherab-themed-certificate">',
			certificate.outerHTML,
			'</main>',
			'</body>',
			'</html>'
		].join(""));
		doc.close();

		function resizeFrame() {
			var frameDoc = frame.contentDocument || frame.contentWindow.document;
			var frameCert = frameDoc.querySelector(".cert-container");
			if (!frameCert) {
				return;
			}
			var rect = frameCert.getBoundingClientRect();
			frame.style.height = Math.ceil(rect.height + 2) + "px";
			root.className += " sherab-cert-android-frame-ready";
		}

		window.setTimeout(resizeFrame, 50);
		window.setTimeout(resizeFrame, 250);
		window.setTimeout(resizeFrame, 800);
	}

	lockDefaultCertificateLight();
	window.addEventListener("load", function() {
		lockDefaultCertificateLight();
		isolateAndroidCertificateContainer();
		window.setTimeout(lockDefaultCertificateLight, 100);
		window.setTimeout(lockDefaultCertificateLight, 600);
		window.setTimeout(isolateAndroidCertificateContainer, 100);
		window.setTimeout(isolateAndroidCertificateContainer, 600);
	});
})();
