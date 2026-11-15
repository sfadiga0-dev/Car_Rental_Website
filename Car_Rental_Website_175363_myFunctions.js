/* ==========================================================================
   myFunctions.js - ملف الدوال البرمجية وتفاعلات jQuery (IWB202 - F25)
   الطالب: Sankoumba (175363)
   ========================================================================== */

/* تفعيل سلوك إظهار وإخفاء التفاصيل عبر مكتبة jQuery عند جاهزية الصفحة */
$(document).ready(function () {
    /* تحميل الصور الفوتوغرافية الحقيقية المطابقة لكل موديل سيارة في حال توفر اتصال بالإنترنت */
    var exactRealCarPhotos = {
        "img_cr001": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/2023_Toyota_Corolla_LE_in_Blueprint%2C_front_left.jpg/640px-2023_Toyota_Corolla_LE_in_Blueprint%2C_front_left.jpg",
        "img_cr002": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/2022_Kia_Sportage_GT-Line_ISG_HEV_Automatic_1.6_Front.jpg/640px-2022_Kia_Sportage_GT-Line_ISG_HEV_Automatic_1.6_Front.jpg",
        "img_cr003": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/2024_Hyundai_Elantra_Limited_in_Ecotronic_Gray%2C_front_left%2C_05-12-2024.jpg/640px-2024_Hyundai_Elantra_Limited_in_Ecotronic_Gray%2C_front_left%2C_05-12-2024.jpg",
        "img_cr004": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/2019_Chevrolet_Spark_LS%2C_front_8.11.19.jpg/640px-2019_Chevrolet_Spark_LS%2C_front_8.11.19.jpg",
        "img_cr005": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/2024_Hyundai_Tucson_Hybrid_Limited_in_Amazon_Gray%2C_front_left%2C_2024-06-15.jpg/640px-2024_Hyundai_Tucson_Hybrid_Limited_in_Amazon_Gray%2C_front_left%2C_2024-06-15.jpg"
    };
    $.each(exactRealCarPhotos, function (imgId, realUrl) {
        var $img = $("#" + imgId);
        if ($img.length > 0) {
            var probe = new Image();
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
        var targetRowId = $(this).attr("data-target");
        if ($(this).is(":checked")) {
            $("#" + targetRowId).fadeIn(250);
        } else {
            $("#" + targetRowId).fadeOut(200);
        }
    });

    /* 2. تلوين سطر السيارة عند تحديد مربع "اختيار" باستخدام jQuery */
    $(".select-car").on("change", function () {
        if ($(this).is(":checked")) {
            $(this).closest("tr").addClass("selected-row");
        } else {
            $(this).closest("tr").removeClass("selected-row");
        }
    });

    /* 3. عند الضغط على الزر "متابعة" لإظهار نموذج الحجز في نفس الصفحة */
    $("#btnProceed").on("click", function () {
        var selectedCount = $(".select-car:checked").length;
        if (selectedCount === 0) {
            alert("يرجى اختيار سيارة واحدة على الأقل من عمود (اختيار) قبل المتابعة إلى نموذج الحجز.");
            return;
        }
        $("#bookingSection").slideDown(350);
        $("html, body").animate({
            scrollTop: $("#bookingSection").offset().top - 20
        }, 400);
    });
});

/* دالة مساعدة لإظهار أو إخفاء رسائل الخطأ بجانب الحقول */
function setFieldError(errorId, message) {
    var errElem = document.getElementById(errorId);
    if (errElem) {
        if (message !== "") {
            errElem.innerHTML = message;
            errElem.style.display = "block";
        } else {
            errElem.innerHTML = "";
            errElem.style.display = "none";
        }
    }
}

/* الدالة الرئيسية للتحقق من مدخلات نموذج الحجز وحساب التكلفة الإجمالية */
function validateAndSubmitBooking() {
    var isValid = true;

    /* قراءة القيم من عناصر HTML */
    var fullName = document.getElementById("fullName").value.replace(/^\s+|\s+$/g, "");
    var nationalId = document.getElementById("nationalId").value.replace(/^\s+|\s+$/g, "");
    var startDateStr = document.getElementById("startDate").value.replace(/^\s+|\s+$/g, "");
    var endDateStr = document.getElementById("endDate").value.replace(/^\s+|\s+$/g, "");
    var mobile = document.getElementById("mobile").value.replace(/^\s+|\s+$/g, "");
    var email = document.getElementById("email").value.replace(/^\s+|\s+$/g, "");

    /* 1. التحقق من الاسم الكامل (اختياري يقبل القيمة الفارغة، وفي حال إدخاله يجب أن يكون أحرفاً عربية فقط) */
    var arabicNameRegex = /^[\u0621-\u064A\s]+$/;
    if (fullName !== "" && !arabicNameRegex.test(fullName)) {
        setFieldError("errFullName", "خطأ: يجب أن يتكون الاسم الكامل من أحرف هجائية عربية فقط.");
        isValid = false;
    } else {
        setFieldError("errFullName", "");
    }

    /* 2. التحقق من الرقم الوطني (إلزامي، 11 خانة رقمية، أول خانتين ترمزان للمحافظة 01-14) */
    var nationalIdRegex = /^(0[1-9]|1[0-4])[0-9]{9}$/;
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
    var dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    var startValid = false;
    var endValid = false;

    if (startDateStr === "") {
        setFieldError("errStartDate", "خطأ: تاريخ بداية التأجير إلزامي الإدخال.");
        isValid = false;
    } else if (!dateRegex.test(startDateStr)) {
        setFieldError("errStartDate", "خطأ: يجب إدخال تاريخ البداية بالصيغة الصحيحة yyyy-mm-dd.");
        isValid = false;
    } else {
        setFieldError("errStartDate", "");
        startValid = true;
    }

    if (endDateStr === "") {
        setFieldError("errEndDate", "خطأ: تاريخ نهاية التأجير إلزامي الإدخال.");
        isValid = false;
    } else if (!dateRegex.test(endDateStr)) {
        setFieldError("errEndDate", "خطأ: يجب إدخال تاريخ النهاية بالصيغة الصحيحة yyyy-mm-dd.");
        isValid = false;
    } else {
        setFieldError("errEndDate", "");
        endValid = true;
    }

    var rentalDays = 0;
    if (startValid && endValid) {
        var sParts = startDateStr.split("-");
        var eParts = endDateStr.split("-");
        var startObj = new Date(parseInt(sParts[0], 10), parseInt(sParts[1], 10) - 1, parseInt(sParts[2], 10));
        var endObj = new Date(parseInt(eParts[0], 10), parseInt(eParts[1], 10) - 1, parseInt(eParts[2], 10));

        var diffTime = endObj.getTime() - startObj.getTime();
        rentalDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (rentalDays <= 0) {
            setFieldError("errEndDate", "خطأ: يجب أن يكون تاريخ نهاية التأجير لاحقاً لتاريخ بداية التأجير.");
            isValid = false;
        }
    }

    /* 4. التحقق من رقم الموبايل (اختياري يقبل القيمة الفارغة، وإن أُدخل يجب أن يطابق شبكتي Syriatel أو MTN) */
    /* رموز سيريتل: 093, 098, 099 | رموز إم تي إن: 094, 095, 096 (10 خانات أو مع +963 / 00963) */
    var syrianMobileRegex = /^(?:09[345689]\d{7}|(?:\+963|00963)9[345689]\d{7})$/;
    if (mobile !== "" && !syrianMobileRegex.test(mobile)) {
        setFieldError("errMobile", "خطأ: رقم الموبايل يجب أن يطابق شبكتي Syriatel (093/098/099) أو MTN (094/095/096) ويتكون من 10 أرقام.");
        isValid = false;
    } else {
        setFieldError("errMobile", "");
    }

    /* 5. التحقق من البريد الإلكتروني (اختياري يقبل القيمة الفارغة، وإن أُدخل يجب أن يكون بصيغة صحيحة) */
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email !== "" && !emailRegex.test(email)) {
        setFieldError("errEmail", "خطأ: صيغة البريد الإلكتروني غير صحيحة (مثال: name@domain.com).");
        isValid = false;
    } else {
        setFieldError("errEmail", "");
    }

    /* التأكد من استمرار اختيار سيارة واحدة على الأقل */
    var carCheckboxes = document.getElementsByClassName("select-car");
    var selectedCars = [];
    var i;
    for (i = 0; i < carCheckboxes.length; i++) {
        if (carCheckboxes[i].checked) {
            selectedCars.push({
                code: carCheckboxes[i].getAttribute("data-code"),
                model: carCheckboxes[i].getAttribute("data-model"),
                price: parseFloat(carCheckboxes[i].getAttribute("data-price"))
            });
        }
    }

    if (selectedCars.length === 0) {
        alert("يرجى اختيار سيارة واحدة على الأقل من الجدول.");
        return false;
    }

    if (!isValid) {
        return false;
    }

    /* حساب المبلغ الإجمالي وتطبيق خصم 10% في حال تجاوزت مدة التأجير 7 أيام */
    var totalBeforeDiscount = 0;
    var carsSummaryHtml = "<ul>";
    var carsSummaryText = "";

    for (i = 0; i < selectedCars.length; i++) {
        var carCost = selectedCars[i].price * rentalDays;
        totalBeforeDiscount += carCost;
        carsSummaryHtml += "<li><strong>" + selectedCars[i].model + " (" + selectedCars[i].code + ")</strong>: " +
                           rentalDays + " يوم × " + selectedCars[i].price.toLocaleString() + " ل.س = <strong>" +
                           carCost.toLocaleString() + " ل.س</strong></li>";
        carsSummaryText += "- " + selectedCars[i].model + " (" + selectedCars[i].code + "): " +
                           rentalDays + " يوم = " + carCost.toLocaleString() + " ل.س\n";
    }
    carsSummaryHtml += "</ul>";

    var discountAmount = 0;
    var discountNote = "لا يوجد خصم (مدة التأجير 7 أيام أو أقل)";
    if (rentalDays > 7) {
        discountAmount = totalBeforeDiscount * 0.10;
        discountNote = "تم تطبيق خصم 10% لتجاوز مدة التأجير 7 أيام (-" + discountAmount.toLocaleString() + " ل.س)";
    }
    var finalTotal = totalBeforeDiscount - discountAmount;

    /* عرض النتيجة في الصفحة دون إعادة تحميل + نافذة تنبيه بالملخص */
    var applicantDisplay = (fullName !== "") ? fullName : "غير محدد (الرقم الوطني: " + nationalId + ")";
    var resultHtml = "<h3 style=\"color:#15803d; margin-top:0;\">تم استلام طلب الحجز بنجاح</h3>" +
                     "<p><strong>مقدم الطلب:</strong> " + applicantDisplay + "</p>" +
                     "<p><strong>فترة التأجير:</strong> من " + startDateStr + " إلى " + endDateStr + " (<strong>" + rentalDays + " يوم</strong>)</p>" +
                     "<p><strong>السيارات المختارة وتفاصيل التكلفة:</strong></p>" + carsSummaryHtml +
                     "<p><strong>المجموع قبل الخصم:</strong> " + totalBeforeDiscount.toLocaleString() + " ل.س</p>" +
                     "<p><strong>حالة الخصم:</strong> " + discountNote + "</p>" +
                     "<p style=\"font-size:18px; color:#0b5380;\"><strong>المبلغ الإجمالي النهائي المطلوب: " + finalTotal.toLocaleString() + " ل.س</strong></p>";

    var resBox = document.getElementById("resultBox");
    resBox.innerHTML = resultHtml;
    $("#resultBox").fadeIn(300);

    var alertMsg = "تم تأكيد طلب الحجز بنجاح!\n\n" +
                   "السيارات المختارة وعدد الأيام (" + rentalDays + " يوم لكل سيارة):\n" +
                   carsSummaryText + "\n" +
                   "المجموع قبل الخصم: " + totalBeforeDiscount.toLocaleString() + " ل.س\n" +
                   "الخصم: " + discountAmount.toLocaleString() + " ل.س\n" +
                   "المبلغ النهائي المطلوب: " + finalTotal.toLocaleString() + " ل.س";
    alert(alertMsg);

    return false;
}
