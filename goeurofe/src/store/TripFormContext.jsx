import React, { createContext, useContext, useReducer, useEffect, useMemo } from "react";

const SS_KEY = "tripFormState_v1";

/**
 * 프론트엔드에서 관리하는 전역 상태 스키마 (UI 친화적 key)
 */
const initialState = {
  // 도시/공항
  departure: "",   // 출발지
  arrival: "",     // 도착지

  // 날짜
  date: 0,         // 총 일수 (예: 9박10일 = 10)
  startDay: "",    // "YYYY.MM.DD" or "YYYY-MM-DD"
  endDay: "",

  // 목적/테마
  purpose: "",     // "휴양" | "관광" | "액티비티" | "기타"
  tema: "",        // "쇼핑" | "맛집" | "자연경관" | "기타" (기존 코드 호환 유지)

  // 동행
  people: "",      // "단독" | "커플" | "친구" | "가족" | "반려동물"
};

/** 세션에서 불러오되 누락 키는 기본값으로 채우기 */
function loadFromSession() {
  try {
    const raw = sessionStorage.getItem(SS_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) || {};
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
}

/** 리듀서 */
function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.key]: action.value };
    case "SET_MANY":
      return { ...state, ...action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const TripFormStateCtx = createContext(null);
const TripFormDispatchCtx = createContext(null);

/** Provider */
export function TripFormProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadFromSession);

  // 세션스토리지 동기화
  useEffect(() => {
    sessionStorage.setItem(SS_KEY, JSON.stringify(state));
  }, [state]);

  const actions = useMemo(
    () => ({
      setField: (key, value) => dispatch({ type: "SET_FIELD", key, value }),
      setMany: (payload) => dispatch({ type: "SET_MANY", payload }),
      reset: () => dispatch({ type: "RESET" }),
    }),
    []
  );

  return (
    <TripFormStateCtx.Provider value={state}>
      <TripFormDispatchCtx.Provider value={actions}>
        {children}
      </TripFormDispatchCtx.Provider>
    </TripFormStateCtx.Provider>
  );
}

/** 읽기 훅 */
export function useTripFormState() {
  const ctx = useContext(TripFormStateCtx);
  if (!ctx) throw new Error("useTripFormState must be used within TripFormProvider");
  return ctx;
}

/** 쓰기 훅 */
export function useTripFormActions() {
  const ctx = useContext(TripFormDispatchCtx);
  if (!ctx) throw new Error("useTripFormActions must be used within TripFormProvider");
  return ctx;
}

/* -------------------------- */
/* 🔁 백엔드 전송용 매핑 유틸  */
/* -------------------------- */

/** "YYYY.MM.DD" → "YYYY-MM-DD" 변환 */
const toIsoDate = (d) => (d ? d.replaceAll(".", "-").replace(/-+/g, "-") : "");

/**
 * 백엔드 요구 스키마로 변환
 */
export function buildBackendPayload(form) {
  return {
    start: form.departure || "",
    end: form.arrival || "",
    days: form.date ?? 0,

    startDate: toIsoDate(form.startDay),
    endDate: toIsoDate(form.endDay),

    purpose: form.purpose || "",
    theme: form.tema || form.theme || "",
    party: form.people || "",

    flightInfo: null,
    accommodationInfo: null,
    preferInfo: null,
  };
}

/**
 * 백엔드로 POST할 때 사용 (옵션 A: form을 인자로 받음)
 * @param {AxiosInstance} api - axios 인스턴스
 * @param {string} url - 백엔드 URL
 * @param {object} form - useTripFormState()로 가져온 상태
 */
export async function submitTrip(api, url, form) {
  const payload = buildBackendPayload(form);
  const res = await api.post(url, payload);
  return res?.data ?? true;
}
