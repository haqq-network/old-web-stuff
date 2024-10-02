// Constants
var FALCONER_URL = "https://falconer.haqq.sh";
var API_DOMAIN = "https://old-haqq-stuff.vercel.app"; // Base domain for the API
var REQUEST_HEADERS = {
  "Content-Type": "application/json",
};
var DEFAULT_LOCALE = "en-US";

// Matches language tags as defined in RFC 5646
var regex =
  /^((?:(en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))|((?:([A-Za-z]{2,3}(-(?:[A-Za-z]{3}(-[A-Za-z]{3}){0,2}))?)|[A-Za-z]{4}|[A-Za-z]{5,8})(-(?:[A-Za-z]{4}))?(-(?:[A-Za-z]{2}|[0-9]{3}))?(-(?:[A-Za-z0-9]{5,8}|[0-9][A-Za-z0-9]{3}))*(-(?:[0-9A-WY-Za-wy-z](-[A-Za-z0-9]{2,8})+))*(-(?:x(-[A-Za-z0-9]{1,8})+))?)|(?:x(-[A-Za-z0-9]{1,8})+))$/;

function formatNumber(
  numberToFormat,
  minimumFractionDigits,
  maximumFractionDigits,
  locale
) {
  minimumFractionDigits =
    minimumFractionDigits !== undefined ? minimumFractionDigits : 0; // Default value set to 0
  maximumFractionDigits =
    maximumFractionDigits !== undefined ? maximumFractionDigits : 3; // Default value set to 3
  locale = locale || DEFAULT_LOCALE; // Default locale

  // Check if locale is valid
  if (!regex.test(locale)) {
    console.warn(
      'Invalid locale "' +
        locale +
        '". Falling back to default locale "' +
        DEFAULT_LOCALE +
        '".'
    );
    locale = DEFAULT_LOCALE;
  }

  return numberToFormat.toLocaleString(locale, {
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
  });
}

// Function to get Shell Chain Stats data
function getShellChainStatsData() {
  // Create request URL
  var requestUrl = new URL("/haqq/chain_stats", FALCONER_URL);
  return fetch(requestUrl, {
    method: "GET",
    headers: REQUEST_HEADERS,
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Chain stats fetch failed");
      }
      return response.json();
    })
    .then(function (data) {
      return data; // Возвращаем весь объект
    });
}

// Function to get price data
function getIslamicPriceData() {
  // Create request URL
  var requestUrl = new URL("/islamic/price", FALCONER_URL);
  return fetch(requestUrl, {
    method: "GET",
    headers: REQUEST_HEADERS,
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Price fetch failed");
      }
      return response.json();
    })
    .then(function (data) {
      return data.price;
    });
}

// Function to update #price
function updatePrice() {
  // Fetch price data
  getIslamicPriceData()
    .then(function (price) {
      var priceElement = document.querySelector("[data-islm-price]");
      if (priceElement) {
        priceElement.textContent = formatNumber(Number(price)); // Convert price to number and format it
      }
    })
    .catch(function (error) {
      console.error("Failed to fetch price:", error);
      var priceElement = document.getElementById("price");
      if (priceElement) {
        priceElement.textContent = "Error fetching price.";
      }
    });
}

// Function to update chain stats using data attributes
function updateChainStats() {
  // Fetch chain stats data
  getShellChainStatsData()
    .then(function (chainStats) {
      console.log("chainStats", { chainStats });

      // Update Mainnet accounts created
      var accountsElement = document.querySelector(
        "[data-chain-stats-accounts]"
      );
      if (accountsElement) {
        accountsElement.textContent = formatNumber(Number(chainStats.accounts)); // Convert accounts to number and format it
      }

      // Update Transactions in the last 24 hours
      var transactionsElement = document.querySelector(
        "[data-chain-stats-transactions]"
      );
      if (transactionsElement) {
        transactionsElement.textContent = formatNumber(
          Number(chainStats.transactionsIn24Hour) // Convert transactions to number and format it
        );
      }

      // Update Seconds to consensus finality
      var finalityElement = document.querySelector(
        "[data-chain-stats-finality]"
      );
      if (finalityElement) {
        finalityElement.textContent = formatNumber(
          Number(chainStats.consensusFinality) // Convert finality to number and format it
        );
      }

      // Update Average cost per transaction
      var costElement = document.querySelector("[data-chain-stats-cost]");
      if (costElement) {
        costElement.textContent = formatNumber(
          Number(chainStats.transactionAvgCost)
        ); // Convert cost to number and format it
      }

      // Update Active Validators
      var validatorsActiveElement = document.querySelector(
        "[data-chain-stats-validators-active]"
      );
      if (validatorsActiveElement) {
        validatorsActiveElement.textContent = formatNumber(
          Number(chainStats.validatorsActive)
        );
      }

      // Update Total Supply
      var totalSupplyElement = document.querySelector(
        "[data-chain-stats-total-supply]"
      );
      if (totalSupplyElement) {
        totalSupplyElement.textContent = formatNumber(
          Number(chainStats.supply)
        );
      }

      // Update Staked
      var stakedElement = document.querySelector("[data-chain-stats-staked]");
      if (stakedElement) {
        stakedElement.textContent = formatNumber(Number(chainStats.staked));
      }

      // Update Supply
      var supplyElement = document.querySelector("[data-chain-stats-supply]");
      if (supplyElement) {
        supplyElement.textContent = formatNumber(Number(chainStats.supply)); // Convert supply to number and format it
      }

      // Update Circulating Supply
      var circulatingSupplyElement = document.querySelector(
        "[data-chain-stats-circulating-supply]"
      );
      if (circulatingSupplyElement) {
        circulatingSupplyElement.textContent = formatNumber(
          Number(chainStats.circulatingSupply) // Convert circulating supply to number and format it
        );
      }

      // Update staking amount
      var stakedAmountElement = document.querySelector(
        "[data-chain-stats-staked-amount]"
      );
      if (stakedAmountElement) {
        stakedAmountElement.textContent = formatNumber(
          Number(chainStats.staked) // Convert staking amount to number and format it
        );
      }

      // Update staking ratio
      var stakedRatioElement = document.querySelector(
        "[data-chain-stats-staked-ratio]"
      );
      if (stakedRatioElement) {
        stakedRatioElement.textContent = formatNumber(
          Number(chainStats.stakeRatio * 100),
          2,
          2,
          window.navigator.language
        );
      }

      // Update Validators count
      var validatorsCountElement = document.querySelector(
        "[data-chain-stats-validators-count]"
      );
      if (validatorsCountElement) {
        validatorsCountElement.textContent = formatNumber(
          Number(chainStats.validatorsCount)
        );
      }

      // Update Active validators count
      var activeValidatorsCountElement = document.querySelector(
        "[data-chain-stats-active-validators-count]"
      );
      if (activeValidatorsCountElement) {
        activeValidatorsCountElement.textContent = formatNumber(
          Number(chainStats.validatorsActive)
        );
      }
    })
    .catch(function (error) {
      console.error("Failed to fetch chain stats:", error);
      // Error handling
    });
}

// Initialize Feedback form
function initializeFeedbackForm() {
  console.log("Initializing feedback form");
  // Get feedback form element
  var feedbackForm = document.getElementById("feedback-form");
  if (!feedbackForm) {
    console.warn("Feedback form not found");
    return;
  }

  var feedbackSubmitButton = feedbackForm.querySelector(
    "#feedback-form input[type='submit']"
  );
  var feedbackTurnstileToken = "";

  // Callback function for Turnstile success
  window.onFeedbackTurnstileSuccess = function (token) {
    console.log("Feedback Turnstile token received");
    feedbackTurnstileToken = token;
    feedbackSubmitButton.disabled = false; // Enable the submit button
    console.log("Feedback submit button enabled");
  };

  feedbackForm.addEventListener("submit", function (event) {
    console.log("Feedback form submitted", { event });
    event.preventDefault();

    var formData = new FormData(feedbackForm);
    console.log("Feedback form data collected");

    var jsonData = {
      email: formData.get("feedback-email"),
      name: formData.get("feedback-name"),
      message: formData.get("feedback-message"),
      token: feedbackTurnstileToken,
    };
    console.log("Feedback JSON data prepared", jsonData);

    var feedbackApiUrl = new URL("/api/feedback", API_DOMAIN);
    console.log("Sending feedback data to:", feedbackApiUrl.toString());

    fetch(feedbackApiUrl, {
      method: "POST",
      headers: REQUEST_HEADERS,
      body: JSON.stringify(jsonData),
    })
      .then(function (response) {
        console.log("Feedback API response received", response);
        if (response.ok) {
          return response.json();
        }
        throw new Error("Feedback form submission failed.");
      })
      .then(function (data) {
        console.log("Feedback form successfully submitted:", data);
        alert("Feedback form successfully submitted!");
      })
      .catch(function (error) {
        console.error("Feedback form submission error:", error);
        alert("Feedback form submission error.");
      });
  });
}

// Initialize Subscribe form
function initializeSubscribeForm() {
  console.log("Initializing subscribe form");
  // Get subscribe form element
  var subscribeForm = document.getElementById("subscribe-form");
  if (!subscribeForm) {
    console.warn("Subscribe form not found");
    return;
  }

  var subscribeSubmitButton = subscribeForm.querySelector(
    "#subscribe-form input[type='submit']"
  );
  var subscribeTurnstileToken = "";

  // Callback function for Turnstile success
  window.onSubscribeTurnstileSuccess = function (token) {
    console.log("Subscribe Turnstile token received");
    subscribeTurnstileToken = token;
    subscribeSubmitButton.disabled = false; // Enable the submit button
    console.log("Subscribe submit button enabled");
  };

  subscribeForm.addEventListener("submit", function (event) {
    console.log("Subscribe form submitted", { event });
    event.preventDefault();

    var formData = new FormData(subscribeForm);
    console.log("Subscribe form data collected");

    var jsonData = {
      email: formData.get("subscribe-email"),
      name: formData.get("subscribe-name"),
      token: subscribeTurnstileToken,
    };
    console.log("Subscribe JSON data prepared", jsonData);

    var subscribeApiUrl = new URL("/api/subscribe", API_DOMAIN);
    console.log("Sending subscribe data to:", subscribeApiUrl.toString());

    fetch(subscribeApiUrl, {
      method: "POST",
      headers: REQUEST_HEADERS,
      body: JSON.stringify(jsonData),
    })
      .then(function (response) {
        console.log("Subscribe API response received", response);
        if (response.ok) {
          return response.json();
        }
        throw new Error("Subscribe form submission failed.");
      })
      .then(function (data) {
        console.log("Subscribe form successfully submitted:", data);
        alert("Subscribe form successfully submitted!");
      })
      .catch(function (error) {
        console.error("Subscribe form submission error:", error);
        alert("Subscribe form submission error.");
      });
  });
}

// Function to start updating price every 5 seconds
function startPriceUpdates() {
  updatePrice(); // Initial update
  setInterval(updatePrice, 5000); // Update every 5 seconds
}

// Single DOMContentLoaded event listener for initialization
document.addEventListener("DOMContentLoaded", function () {
  // Update price data
  startPriceUpdates(); // Update price data
  updateChainStats(); // Update Chain Stats data
  initializeFeedbackForm(); // Initialize Feedback form
  initializeSubscribeForm(); // Initialize Subscribe form
});
