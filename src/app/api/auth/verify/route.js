import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, pin, password } = body;

    // 0. Master Staff Portal Passcode Check (/login)
    if (type === 'portal') {
      const serverPortalKey = process.env.MASTER_PORTAL_KEY || 'PokaranStaff@2026';
      if (password === serverPortalKey) {
        return NextResponse.json({ 
          success: true, 
          role: 'hospital_staff',
          message: 'Master Staff Access Granted' 
        });
      }
      return NextResponse.json(
        { success: false, message: 'Invalid Staff Password!' }, 
        { status: 401 }
      );
    }

    // 1. Room 01: General OPD Doctor PIN Check
    if (type === 'opd') {
      const serverOpdPin = process.env.OPD_STAFF_PIN || '1010';
      if (pin === serverOpdPin) {
        return NextResponse.json({ 
          success: true, 
          role: 'opd_doctor',
          room: 'Room 01 (General OPD)' 
        });
      }
      return NextResponse.json(
        { success: false, message: 'Invalid Doctor PIN! (Default: 1010)' }, 
        { status: 401 }
      );
    }

    // 2. Room 04: Pathology Lab PIN Check
    if (type === 'lab') {
      const serverLabPin = process.env.LAB_STAFF_PIN || '4040';
      if (pin === serverLabPin) {
        return NextResponse.json({ 
          success: true, 
          role: 'lab_staff',
          room: 'Room 04 (Pathology Lab)' 
        });
      }
      return NextResponse.json(
        { success: false, message: 'Invalid Lab PIN! (Default: 4040)' }, 
        { status: 401 }
      );
    }

    // 3. Room 07: Digital X-Ray PIN Check
    if (type === 'xray') {
      const serverXrayPin = process.env.XRAY_STAFF_PIN || '7070';
      if (pin === serverXrayPin) {
        return NextResponse.json({ 
          success: true, 
          role: 'xray_staff',
          room: 'Room 07 (Digital X-Ray)' 
        });
      }
      return NextResponse.json(
        { success: false, message: 'Invalid X-Ray PIN! (Default: 7070)' }, 
        { status: 401 }
      );
    }

    // 4. Room 11: Sonography (USG) PIN Check
    if (type === 'usg') {
      const serverUsgPin = process.env.USG_STAFF_PIN || '1111';
      if (pin === serverUsgPin) {
        return NextResponse.json({ 
          success: true, 
          role: 'usg_staff',
          room: 'Room 11 (Sonography USG)' 
        });
      }
      return NextResponse.json(
        { success: false, message: 'Invalid USG PIN! (Default: 1111)' }, 
        { status: 401 }
      );
    }

    // 5. Indoor Wards & ICU Beds PIN Check
    if (type === 'beds') {
      const serverBedsPin = process.env.BEDS_STAFF_PIN || '2020';
      if (pin === serverBedsPin) {
        return NextResponse.json({ 
          success: true, 
          role: 'ward_nurse',
          room: 'Indoor Wards & ICU' 
        });
      }
      return NextResponse.json(
        { success: false, message: 'Invalid Ward PIN! (Default: 2020)' }, 
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Invalid authentication request type' }, 
      { status: 400 }
    );

  } catch (error) {
    console.error('Auth verification server error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server verification error' }, 
      { status: 500 }
    );
  }
}