/**
 * 실행 시간: 10.933ms
 *
 * 변경 사항:
 * 1. 변수명 변경: volumeCredits → totalCredits
 * 2. switch문에서 "comedy"의 금액 계산 방식 수정: if문 순서 변경
 * 3. for-of 루프 사용 → 불필요한 배열(map, reduce) 생성 방지
 * 4. 청구 내역 출력 시 문자열 포맷 변경 (청구 내역 추가 순서 조정)
 */
export function statement(invoice, plays) {
  console.time("01-example statement01 실행 시간");

  try {
    const format = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format;

    let totalAmount = 0;
    let totalCredits = 0;
    let result = `청구내역 (고객명: ${invoice.customer})\n`;

    // for-of 루프 사용 → 불필요한 배열(map, reduce) 생성 방지
    for (const perf of invoice.performances) {
      const play = plays[perf.playID];

      let thisAmount = 0;
      switch (play.type) {
        case "tragedy":
          thisAmount = 40_000;
          if (perf.audience > 30) {
            thisAmount += 1_000 * (perf.audience - 30);
          }
          break;
        case "comedy":
          thisAmount = 30_000 + 300 * perf.audience;
          if (perf.audience > 20) {
            thisAmount += 10_000 + 500 * (perf.audience - 20);
          }
          break;
        default:
          throw new Error(`알 수 없는 장르: ${play.type}`);
      }

      // 포인트 계산
      totalCredits += Math.max(perf.audience - 30, 0);
      if (play.type === "comedy") {
        totalCredits += Math.floor(perf.audience / 5);
      }

      // 청구 내역 추가
      result += `${play.name}: ${format(thisAmount / 100)} ${
        perf.audience
      }석\n`;
      totalAmount += thisAmount;
    }

    // 최종 합산 결과 추가
    result += `총액 ${format(totalAmount / 100)}\n`;
    result += `적립 포인트 ${totalCredits}점\n`;

    return result;
  } finally {
    console.timeEnd("01-example statement01 실행 시간");
  }
}
