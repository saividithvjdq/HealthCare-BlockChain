const sampleAadhaarData = {
  '999941057058': {
    name: 'Shivshankar Choudhury',
    dob: '13-05-1968',
    dobt: 'V',
    gender: 'M',
    phone: '2810806979',
    email: 'sschoudhury@dummyemail.com',
    address: {
      street: '12 Maulana Azad Marg',
      vtc: 'New Delhi',
      subdist: 'New Delhi',
      district: 'New Delhi',
      state: 'New delhi',
      pincode: '110002'
    }
  },
  '999971658847': {
    name: 'Kumar Agarwal',
    dob: '04-05-1978',
    dobt: 'A',
    gender: 'M',
    phone: '2314475929',
    email: 'kma@mailserver.com',
    address: {
      building: 'IPP, IAP',
      landmark: 'Opp RSEB Window',
      street: '5A Madhuban',
      locality: 'Veera Desai Road',
      vtc: 'Udaipur',
      district: 'Udaipur',
      state: 'Rajasthan',
      pincode: '313001'
    }
  },
  '999933119405': {
    name: 'Fatima Bedi',
    dob: '30-07-1943',
    dobt: 'A',
    gender: 'F',
    phone: '2837032088',
    email: 'bedi2020@mailserver.com',
    address: {
      building: 'K-3A Rampur Garden',
      vtc: 'Bareilly',
      district: 'Bareilly',
      state: 'Uttar Pradesh',
      pincode: '243001'
    }
  },
  '999955183433': {
    name: 'Rohit Pandey',
    dob: '08-07-1985',
    dobt: 'A',
    gender: 'M',
    phone: '2821096353',
    email: 'rpandey@mailserver.com',
    address: {
      building: '603/4 Vindyachal',
      street: '7TH Road Raja Wadi',
      locality: 'Neelkanth Valley',
      poname: 'Ghatkopar (EAST)',
      vtc: 'Mumbai',
      district: 'Mumbai',
      state: 'Maharastra',
      pincode: '243001'
    }
  },
  '999990501894': {
    name: 'Anisha Jay Kapoor',
    gender: 'F',
    dob: '01-01-1982',
    dobt: 'V',
    address: {
      building: '2B 203',
      street: '14 Main Road',
      locality: 'Jayanagar',
      district: 'Bangalore',
      state: 'Karnataka',
      pincode: '560036'
    }
  },
  '123456789012': {
    name: 'John Doe',
    gender: 'M',
    dob: '15-06-1990',
    dobt: 'V',
    phone: '9876543210',
    email: 'john.doe@example.com',
    address: {
      building: 'A-101',
      street: 'Main Street',
      locality: 'Downtown',
      district: 'Central',
      state: 'Delhi',
      pincode: '110001'
    }
  }
};

class AadhaarService {
  static verifyAadhaar(aadhaarNumber) {
    return new Promise((resolve, reject) => {
      if (sampleAadhaarData[aadhaarNumber]) {
        // Simulate OTP generation
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`OTP for Aadhaar ${aadhaarNumber}: ${otp}`);
        
        resolve({
          success: true,
          data: sampleAadhaarData[aadhaarNumber],
          otp: otp
        });
      } else {
        reject(new Error('Aadhaar number not found'));
      }
    });
  }

  static verifyOTP(aadhaarNumber, otp) {
    return new Promise((resolve, reject) => {
      // In a real implementation, you would verify the OTP
      // For this mock service, we'll just return success
      resolve({
        success: true,
        message: 'OTP verified successfully'
      });
    });
  }
}

module.exports = AadhaarService; 