const HOSPITAL_PRICES = {
    None: 0,
    Basic: 90,
    Bronze: 120,
    Silver: 160,
    Gold: 220,
};

const EXTRAS_PRICES = {
    None: 0,
    Basic: 25,
    Standard: 45,
    Premium: 70,
};

function calculateApplicantLoading(age, history, hospitalCover, applicantNumber) {
    const warnings = [];

    if (hospitalCover === "None") {
        return {
            loadingPercent: 0,
            warning: null,
        };
    }

    if (history === "Yes") {
        return {
            loadingPercent: 0,
            warning: null,
        };
    }

    if (history === "Not sure") {
        return {
            loadingPercent: 0,
            warning:
                `Applicant ${applicantNumber}: Cover history is unknown — ` +
                "LHC loading has not been applied. This quote may be inaccurate.",
        };
    }

    if (history === "No" && age > 30) {
        return {
            loadingPercent: (age - 30) * 2,
            warning: null,
        };
    }

    return {
        loadingPercent: 0,
        warning: null,
    };
}

function calculateQuote(quote) {
    const adultCount = quote.cover_type === "Single" ? 1 : 2;

    const hospitalBasePrice = HOSPITAL_PRICES[quote.hospital_cover];
    const extrasBasePrice = EXTRAS_PRICES[quote.extras_cover];

    const applicant1 = calculateApplicantLoading(
        quote.applicant1_age,
        quote.applicant1_cover_history,
        quote.hospital_cover,
        1
    );

    const applicant1Hospital =
        hospitalBasePrice * (1 + applicant1.loadingPercent / 100);

    let applicant2 = null;
    let applicant2Hospital = 0;

    if (adultCount === 2) {
        applicant2 = calculateApplicantLoading(
            quote.applicant2_age,
            quote.applicant2_cover_history,
            quote.hospital_cover,
            2
        );

        applicant2Hospital =
            hospitalBasePrice * (1 + applicant2.loadingPercent / 100);
    }

    const hospitalPremium =
        applicant1Hospital + applicant2Hospital;

    const extrasPremium =
        extrasBasePrice * adultCount;

    const familyUpgradeFee =
        quote.cover_type === "Family" ? 30 : 0;

    const monthlyPremium =
        hospitalPremium + extrasPremium + familyUpgradeFee;

    const yearlyBeforeDiscount =
        monthlyPremium * 12;

    const annualDiscountRate =
        Number(quote.annual_discount) / 100;

    const yearlyAfterDiscount =
        quote.payment_frequency === "Yearly"
            ? yearlyBeforeDiscount * (1 - annualDiscountRate)
            : yearlyBeforeDiscount;

    const warnings = [];

    if (applicant1.warning) {
        warnings.push(applicant1.warning);
    }

    if (applicant2?.warning) {
        warnings.push(applicant2.warning);
    }

    return {
        hospitalPremium: Number(hospitalPremium.toFixed(2)),
        extrasPremium: Number(extrasPremium.toFixed(2)),
        familyUpgradeFee: Number(familyUpgradeFee.toFixed(2)),

        applicant1LoadingPercent: applicant1.loadingPercent,
        applicant2LoadingPercent:
            applicant2 !== null ? applicant2.loadingPercent : null,

        monthlyPremium: Number(monthlyPremium.toFixed(2)),
        yearlyBeforeDiscount: Number(yearlyBeforeDiscount.toFixed(2)),
        yearlyAfterDiscount: Number(yearlyAfterDiscount.toFixed(2)),

        warnings,

        lhcStatement:
            "Lifetime Health Cover loading applies only to hospital cover. " +
            "It does not apply to extras cover.",

        explanation:
            `The hospital premium was calculated separately for ${adultCount} adult` +
            `${adultCount === 1 ? "" : "s"}, including each applicant's LHC loading. ` +
            `The extras premium was calculated using the selected extras tier for ${adultCount} adult` +
            `${adultCount === 1 ? "" : "s"}. ` +
            `${quote.cover_type === "Family"
                ? "A $30 monthly family upgrade fee was added. "
                : ""
            }` +
            `${quote.payment_frequency === "Yearly"
                ? `The ${quote.annual_discount}% annual-payment discount was applied to the yearly total.`
                : "The annual-payment discount was not applied because monthly payment was selected."
            }`,
    };
}

module.exports = {
    calculateQuote,
};