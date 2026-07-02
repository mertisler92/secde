export class QiblaService {
  private static MECCA_LAT = 21.4225;
  private static MECCA_LNG = 39.8262;

  /**
   * Kullanıcının GPS konumundan Mekke'ye (Kâbe) olan açıyı hesaplar.
   */
  static calculateQiblaAngle(userLat: number, userLng: number): number {
    const phiK = (this.MECCA_LAT * Math.PI) / 180;
    const lambdaK = (this.MECCA_LNG * Math.PI) / 180;
    const phi = (userLat * Math.PI) / 180;
    const lambda = (userLng * Math.PI) / 180;

    const numerator = Math.sin(lambdaK - lambda);
    const denominator =
      Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);

    let qiblaRad = Math.atan2(numerator, denominator);
    let qiblaDeg = (qiblaRad * 180) / Math.PI;

    return (qiblaDeg + 360) % 360;
  }

  /**
   * Pusula kalibrasyon durumunu kontrol eder.
   */
  static isSensorUnreliable(accuracyLevel: number): boolean {
    // accuracyLevel: 0 (Unreliable) veya 1 (Low) ise true döner
    return accuracyLevel < 2;
  }
}
