import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { uploadFileCloudinary } from "../../FileHandler/Upload.js";
import { TeamMember } from "../../models/TeamMember/TeamMember.model.js";

const addTeamMember = asyncHandler(async (req, res) => {
      const { fullName, jobTitle, bio, description, socialLinks, experience } =
            req.body;

      const { avatar } = req.files;

      try {
            if (
                  !(
                        fullName &&
                        jobTitle &&
                        bio &&
                        description &&
                        socialLinks &&
                        experience &&
                        avatar
                  )
            ) {
                  return apiErrorHandler(res, 400, "All fields are required");
            }

            if (!avatar) {
                  return apiErrorHandler(
                        res,
                        400,
                        "Please upload an image file"
                  );
            }

            const existingTeamMember = await TeamMember.findOne({ fullName });

            if (existingTeamMember) {
                  return apiErrorHandler(
                        res,
                        400,
                        "Team member already exists"
                  );
            }

            const avatarUrl = await uploadFileCloudinary(avatar[0].path);

            const newTeamMember = await TeamMember.create({
                  fullName,
                  jobTitle,
                  bio,
                  description,
                  socialLinks,
                  experience,
                  avatar: avatarUrl,
            });
            await newTeamMember.save();

            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              newTeamMember,
                              "Team member added successfully"
                        )
                  );
      } catch (error) {
            return apiErrorHandler(500, res, error.message);
      }
});

export { addTeamMember };
