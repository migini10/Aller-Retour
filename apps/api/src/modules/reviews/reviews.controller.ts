import { Controller, Get, Patch, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { GetReviewsDto } from './dto/get-reviews.dto';
import { UpdateReviewStatusDto } from './dto/update-review-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { RbacGuard } from '../../core/rbac/rbac.guard';
import { Roles } from '../../core/rbac/roles.decorator';
import { UserRole } from '@aller-retour/database';

@Controller('v1/reviews')
@UseGuards(AuthGuard('jwt'), RbacGuard)
@Roles(UserRole.SUPER_ADMIN)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findAll(@Query() query: GetReviewsDto) {
    return this.reviewsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateReviewStatusDto: UpdateReviewStatusDto,
  ) {
    return this.reviewsService.updateStatus(id, updateReviewStatusDto);
  }
}
