/* ==========================================================================
   myFunctions.js - ملف الدوال البرمجية وتفاعلات jQuery (IWB202 - F25)
   الطالب: Sankoumba (175363)
   ========================================================================== */

$(function () {
    /* 0. تحميل الصور الفوتوغرافية الحقيقية المطابقة لكل موديل سيارة في حال توفر اتصال بالإنترنت */
    const exactRealCarPhotos = {
        img_cr001: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/2023_Toyota_Corolla_LE_in_Blueprint%2C_front_left.jpg/640px-2023_Toyota_Corolla_LE_in_Blueprint%2C_front_left.jpg",
        img_cr002: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/2022_Kia_Sportage_GT-Line_ISG_HEV_Automatic_1.6_Front.jpg/640px-2022_Kia_Sportage_GT-Line_ISG_HEV_Automatic_1.6_Front.jpg",
        img_cr003: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/2024_Hyundai_Elantra_Limited_in_Ecotronic_Gray%2C_front_left%2C_05-12-2024.jpg/640px-2024_Hyundai_Elantra_Limited_in_Ecotronic_Gray%2C_front_left%2C_05-12-2024.jpg",
        img_cr004: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/2019_Chevrolet_Spark_LS%2C_front_8.11.19.jpg/640px-2019_Chevrolet_Spark_LS%2C_front_8.11.19.jpg",
        img_cr005: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/2024_Hyundai_Tucson_Hybrid_Limited_in_Amazon_Gray%2C_front_left%2C_2024-06-15.jpg/640px-2024_Hyundai_Tucson_Hybrid_Limited_in_Amazon_Gray%2C_front_left%2C_2024-06-15.jpg"
    };

    $.each(exactRealCarPhotos, function (imgId, realUrl) {
        const $img = $("#" + imgId);
        if ($img.length) {
            const probe = new Image();
            probe.onload = function () {
                if ($img[0].naturalWidth <= 480) {
                    $img.attr("src", realUrl);
                }
            };
            probe.src = realUrl;
        }
    });

    /* 1. عند الضغط على مربع الاختيار في عمود "إظهار التفاصيل" */
    $(".toggle-details").on("change", function () {
        const targetRowId = $(this).data("target") || $(this).attr("data-target");
        const $targetRow = $("#" + targetRowId);

        if ($(this).is(":checked")) {
            $targetRow.stop(true, true).fadeIn(250);
        } else {
            $targetRow.stop(true, true).fadeOut(200);
        }
    });

    /* 2. تلوين سطر السيارة عند تحديد مربع "اختيار" باستخدام jQuery */
    $(".select-car").on("change", function () {
        $(this).closest("tr").toggleClass("selected-row", $(this).is(":checked"));
    });

    /* 3. عند الضغط على الزر "متابعة" لإظهار نموذج الحجز في نفس الصفحة */
    $("#btnProceed").on("click", function () {
        const selectedCount = $(".select-car:checked").length;
        if (selectedCount === 0) {
            alert("يرجى اختيار سيارة واحدة على الأقل من عمود (اختيار) قبل المتابعة إلى نموذج الحجز.");
            return;
        }

        const $bookingSection = $("#bookingSection");
        $bookingSection.slideDown(350, function () {
            $("html, body").animate({
                scrollTop: $bookingSection.offset().top - 20
            }, 400);
        });
    });
});

/* دالة مساعدة لتعقيم النصوص ومنع حقن الأكواد (XSS) */
function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (match) {
        const escapeMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "\"": "&quot;",
            "'": "&#39;"
        };
        return escapeMap[match];
    });
}

/* دالة مساعدة لإظهار أو إخفاء رسائل الخطأ بجانب الحقول */
function setFieldError(errorId, message) {
    const errElem = document.getElementById(errorId);
    if (!errElem) return;

    if (message) {
        errElem.textContent = message;
        errElem.style.display = "block";
    } else {
        errElem.textContent = "";
        errElem.style.display = "none";
    }
}

/* دالة مساعدة للتحقق الفعلي من صحة التاريخ في التقويم الميلادي (مثل منع 30 شباط) */
function parseStrictDate(dateStr) {
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!dateRegex.test(dateStr)) return null;

    const [year, month, day] = dateStr.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day);

    if (
        dateObj.getFullYear() !== year ||
        dateObj.getMonth() !== month - 1 ||
        dateObj.getDate() !== day
    ) {
        return null;
    }
    return dateObj;
}

/* الدالة الرئيسية للتحقق من مدخلات نموذج الحجز وحساب التكلفة الإجمالية */
function validateAndSubmitBooking() {
    let isValid = true;

    /* قراءة القيم من عناصر HTML مع إزالة الفراغات الزائدة */
    const fullName = (document.getElementById("fullName")?.value || "").trim();
    const nationalId = (document.getElementById("nationalId")?.value || "").trim();
    const startDateStr = (document.getElementById("startDate")?.value || "").trim();
    const endDateStr = (document.getElementById("endDate")?.value || "").trim();
    const mobile = (document.getElementById("mobile")?.value || "").trim();
    const email = (document.getElementById("email")?.value || "").trim();

    /* 1. التحقق من الاسم الكامل (اختياري، وفي حال إدخاله يجب أن يكون أحرفاً عربية فقط) */
    const arabicNameRegex = /^[\u0621-\u064A\s]+$/;
    if (fullName !== "" && !arabicNameRegex.test(fullName)) {
        setFieldError("errFullName", "خطأ: يجب أن يتكون الاسم الكامل من أحرف هجائية عربية فقط.");
        isValid = false;
    } else {
        setFieldError("errFullName", "");
    }

    /* 2. التحقق من الرقم الوطني (إلزامي، 11 خانة رقمية، أول خانتين ترمزان للمحافظة 01-14) */
    const nationalIdRegex = /^(0[1-9]|1[0-4])\d{9}$/;
    if (nationalId === "") {
        setFieldError("errNationalId", "خطأ: حقل الرقم الوطني إلزامي الإدخال.");
        isValid = false;
    } else if (!nationalIdRegex.test(nationalId)) {
        setFieldError("errNationalId", "خطأ: يجب أن يتألف الرقم الوطني من 11 خانة رقمية وتبدأ أول خانتين برمز محافظة صحيح (01 إلى 14).");
        isValid = false;
    } else {
        setFieldError("errNationalId", "");
    }

    /* 3. التحقق من تاريخ بداية التأجير وتاريخ نهاية التأجير (إلزاميان بصيغة yyyy-mm-dd والنهاية لاحق للبداية) */
    const startObj = parseStrictDate(startDateStr);
    const endObj = parseStrictDate(endDateStr);

    if (startDateStr === "") {
        setFieldError("errStartDate", "خطأ: تاريخ بداية التأجير إلزامي الإدخال.");
        isValid = false;
    } else if (!startObj) {
        setFieldError("errStartDate", "خطأ: يجب إدخال تاريخ بداية صحيح بالصيغة yyyy-mm-dd.");
        isValid = false;
    } else {
        setFieldError("errStartDate", "");
    }

    if (endDateStr === "") {
        setFieldError("errEndDate", "خطأ: تاريخ نهاية التأجير إلزامي الإدخال.");
        isValid = false;
    } else if (!endObj) {
        setFieldError("errEndDate", "خطأ: يجب إدخال تاريخ نهاية صحيح بالصيغة yyyy-mm-dd.");
        isValid = false;
    } else {
        setFieldError("errEndDate", "");
    }

    let rentalDays = 0;
    if (startObj && endObj) {
        const diffTime = endObj.getTime() - startObj.getTime();
        rentalDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (rentalDays <= 0) {
            setFieldError("errEndDate", "خطأ: يجب أن يكون تاريخ نهاية التأجير لاحقاً لتاريخ بداية التأجير.");
            isValid = false;
        }
    }

    /* 4. التحقق من رقم الموبايل (اختياري، وإن أُدخل يجب أن يطابق شبكتي Syriatel أو MTN) */
    /* رموز سيريتل: 093, 098, 099 | رموز إم تي إن: 094, 095, 096 (10 خانات أو مع +963 / 00963) */
    const syrianMobileRegex = /^(?:09[345689]\d{7}|(?:\+963|00963)9[345689]\d{7})$/;
    if (mobile !== "" && !syrianMobileRegex.test(mobile)) {
        setFieldError("errMobile", "خطأ: رقم الموبايل يجب أن يطابق شبكتي Syriatel (093/098/099) أو MTN (094/095/096) ويتكون من 10 أرقام.");
        isValid = false;
    } else {
        setFieldError("errMobile", "");
    }

    /* 5. التحقق من البريد الإلكتروني (اختياري، وإن أُدخل يجب أن يكون بصيغة صحيحة) */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email !== "" && !emailRegex.test(email)) {
        setFieldError("errEmail", "خطأ: صيغة البريد الإلكتروني غير صحيحة (مثال: name@domain.com).");
        isValid = false;
    } else {
        setFieldError("errEmail", "");
    }

    /* التأكد من استمرار اختيار سيارة واحدة على الأقل */
    const selectedCars = Array.from(document.querySelectorAll(".select-car:checked")).map(function (cb) {
        return {
            code: cb.getAttribute("data-code") || "",
            model: cb.getAttribute("data-model") || "",
            price: parseFloat(cb.getAttribute("data-price")) || 0
        };
    });

    if (selectedCars.length === 0) {
        alert("يرجى اختيار سيارة واحدة على الأقل من الجدول.");
        return false;
    }

    if (!isValid) {
        return false;
    }

    /* حساب المبلغ الإجمالي وتطبيق خصم 10% في حال تجاوزت مدة التأجير 7 أيام */
    let totalBeforeDiscount = 0;
    let carsSummaryHtml = "<ul>";
    let carsSummaryText = "";

    selectedCars.forEach(function (car) {
        const carCost = car.price * rentalDays;
        totalBeforeDiscount += carCost;

        carsSummaryHtml += `<li><strong>${escapeHtml(car.model)} (${escapeHtml(car.code)})</strong>: ${rentalDays} يوم × ${car.price.toLocaleString()} ل.س = <strong>${carCost.toLocaleString()} ل.س</strong></li>`;
        carsSummaryText += `- ${car.model} (${car.code}): ${rentalDays} يوم = ${carCost.toLocaleString()} ل.س\n`;
    });
    carsSummaryHtml += "</ul>";

    let discountAmount = 0;
    let discountNote = "لا يوجد خصم (مدة التأجير 7 أيام أو أقل)";
    if (rentalDays > 7) {
        discountAmount = totalBeforeDiscount * 0.10;
        discountNote = `تم تطبيق خصم 10% لتجاوز مدة التأجير 7 أيام (-${discountAmount.toLocaleString()} ل.س)`;
    }
    const finalTotal = totalBeforeDiscount - discountAmount;

    /* عرض النتيجة في الصفحة دون إعادة تحميل + نافذة تنبيه بالملخص */
    const applicantDisplay = fullName !== ""
        ? escapeHtml(fullName)
        : `غير محدد (الرقم الوطني: ${escapeHtml(nationalId)})`;

    const resultHtml = `
        <h3 style="color:#15803d; margin-top:0;">تم استلام طلب الحجز بنجاح</h3>
        <p><strong>مقدم الطلب:</strong> ${applicantDisplay}</p>
        <p><strong>فترة التأجير:</strong> من ${escapeHtml(startDateStr)} إلى ${escapeHtml(endDateStr)} (<strong>${rentalDays} يوم</strong>)</p>
        <p><strong>السيارات المختارة وتفاصيل التكلفة:</strong></p>
        ${carsSummaryHtml}
        <p><strong>المجموع قبل الخصم:</strong> ${totalBeforeDiscount.toLocaleString()} ل.س</p>
        <p><strong>حالة الخصم:</strong> ${discountNote}</p>
        <p style="font-size:18px; color:#0b5380;"><strong>المبلغ الإجمالي النهائي المطلوب: ${finalTotal.toLocaleString()} ل.س</strong></p>
    `;

    const resBox = document.getElementById("resultBox");
    if (resBox) {
        resBox.innerHTML = resultHtml;
        $("#resultBox").stop(true, true).fadeIn(300);
    }

    const alertMsg =
        `تم تأكيد طلب الحجز بنجاح!\n\n` +
        `السيارات المختارة وعدد الأيام (${rentalDays} يوم لكل سيارة):\n` +
        `${carsSummaryText}\n` +
        `المجموع قبل الخصم: ${totalBeforeDiscount.toLocaleString()} ل.س\n` +
        `الخصم: ${discountAmount.toLocaleString()} ل.س\n` +
        `المبلغ النهائي المطلوب: ${finalTotal.toLocaleString()} ل.س`;

    alert(alertMsg);

    return false;
}
